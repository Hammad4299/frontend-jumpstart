import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import Axios from "axios";
import {
    WithValidityState,
    isPaginatedResult,
    extractResponseErrors,
    WithPaginationParams,
    AppResponse,
    PaginationRequestToPaginatedResponse,
    ValidityStateManager
} from "types";
import { routesForContext } from "routing";

export type QueryResultParams<T> = WithPaginationParams<T> | T;
export class BaseService {
    public manager: AxiosInstance;
    protected routes = routesForContext();
    constructor() {
        this.manager = axios.create({
            headers: {
                //Instead of X-CSRF-TOKEN, rely on X-XSRF-TOKEN, laravel supposedly sent it with every response.
                //It contains CSRF token in encrypted form. With every response its lifetime/value should reflect most recent one in case previous session expires and new one exists as a results of rememberMe
                //'X-CSRF-TOKEN': csrftoken,
                Accept: "application/json"
            },
            baseURL: this.routes.server.root()
        });
    }

    protected doXHR<T>(config: AxiosRequestConfig) {
        return Axios.request<T>(config);
    }

    protected doServerXHR<T, X extends string = never>(
        config: AxiosRequestConfig
    ) {
        return this.handleResponse<T, X>(
            this.manager.request<AppResponse<T>>(config)
        );
    }

    protected doServerXHRForCollectionOrPage<
        TRequestParams,
        TResponseData,
        X extends string = never
    >(config?: AxiosRequestConfig) {
        type ResponseType = PaginationRequestToPaginatedResponse<
            TRequestParams,
            AppResponse<TResponseData>,
            TResponseData
        >;
        return this.doServerXHR<TResponseData, X>(config) as Promise<
            WithValidityState<ResponseType, X>
        >;
    }

    public static responseWithValidityState<T, X extends string = never>(
        d: AppResponse<T>
    ) {
        const ret: WithValidityState<AppResponse<T>, X> = d as any;
        ret.validityState = extractResponseErrors(d);
        ret.status = new ValidityStateManager(ret.validityState).isStateValid();
        const response = ret;
        if (isPaginatedResult(response)) {
            response.pagination_meta.current_page = parseInt(
                response.pagination_meta.current_page.toString()
            );
            response.pagination_meta.total = parseInt(
                response.pagination_meta.total.toString()
            );
            response.pagination_meta.per_page = parseInt(
                response.pagination_meta.per_page.toString()
            );
            return response;
        } else {
            return response;
        }
    }

    protected handleResponse<T, TErrors extends string = never>(
        promise: AxiosPromise<AppResponse<T>>
    ) {
        return promise
            .then(data => {
                return BaseService.responseWithValidityState<T, TErrors>(
                    data.data
                );
            })
            .catch(data => {
                const ret: WithValidityState<AppResponse<T>, TErrors> = {
                    data: null,
                    errors: {},
                    status: false,
                    validityState: null
                };

                if (data.response.status === 422) {
                    return ret;
                } else {
                    throw data;
                }
            });
    }
}
