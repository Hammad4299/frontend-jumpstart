import csrftoken from 'externals/CSRFToken';
import axios,{ AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import Axios from 'axios';
import { AppResponse, WithValidityState, isPaginatedResult, extractResponseErrors, WithPaginationParams, MultiItemResultTypeFromRequestParam } from 'types';
import { routesForContext } from 'routing';
import { defaultTo } from 'lodash-es';

export type QueryResultParams<T> = WithPaginationParams<T>|T;
const a:QueryResultParams<{s:string}> = {
    s: '',
    limit: 1
};
export class BaseService {
    private manager:AxiosInstance
    protected routes = routesForContext();
    constructor() {
        this.manager = axios.create({
            headers: {
                'X-CSRF-TOKEN': csrftoken,
                'Accept': 'application/json'
            },
            baseURL: this.routes.server.baseUrl()
        });
    }

    protected doXHR<T>(config:AxiosRequestConfig) {
        return Axios.request<T>(config);
    }

    protected doServerXHR<T>(config:AxiosRequestConfig):Promise<WithValidityState<AppResponse<T>>> {
        return this.handleResponse(this.manager.request<AppResponse<T>>(config));
    }

    protected doServerXHRForCollectionOrPage<T extends QueryResultParams<P>,P>(config?: AxiosRequestConfig) {
        type ResultType = MultiItemResultTypeFromRequestParam<T,P>;
        return this.doServerXHR<ResultType>(config);
    }

    protected handleResponse<T>(promise:AxiosPromise<AppResponse<T>>):Promise<WithValidityState<AppResponse<T>>> {
        return promise.then(data=> {
            const ret:WithValidityState<AppResponse<T>> = data.data as any;
            ret.validityState = extractResponseErrors(data.data);
            return ret;
        }).then(data=>{
            if(isPaginatedResult(data.data)) {
                data.data.current_page = parseInt(data.data.current_page.toString());
                data.data.total = parseInt(data.data.total.toString());
                data.data.per_page = parseInt(data.data.per_page.toString());
                return data;
            } else {
                return data;
            }
        }).catch(data => {
            const ret:WithValidityState<AppResponse<T>> = {
                data: null,
                status: false,
                validityState: null,
                errors: null
            };
            
            if(data.response.status === 422) {
                ret.errors = data.response.data.errors;
                return ret;
            } else {
                 throw data;
            }
        });
    }
}