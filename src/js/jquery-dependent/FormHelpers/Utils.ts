import { defaults } from "lodash-es";
import { AxiosRequestConfig } from "axios";
import { ValidityState, getErrorInfo, AppResponse, extractResponseErrors } from "types";
import { BaseService } from "services";
const errorAttr = 'data-error';

export function updateFieldState(info:ValidityState, container:any) {
    const errors = info;
    for (let field in errors) {
        let fieldError = container.find(`[${errorAttr}='${field}']`);
        if (getErrorInfo(errors, field).hasError) {
            fieldError.removeClass("field-validation-valid").addClass("field-validation-error");
            fieldError.text(getErrorInfo(errors, field).error);
        }
    }
}

export function resetErrors(container:any) {
    container.find(`[${errorAttr}]`)
        .addClass("field-validation-valid")
        .removeClass("field-validation-error");
    container.find(`[${errorAttr}]`).text('');
}

export function submitFormUsingAjax<T>(jForm:JQuery<HTMLFormElement>, overrides:AxiosRequestConfig = {}) {
    resetErrors(jForm);
    const data = new FormData(jForm[0]);
    let options:AxiosRequestConfig = {
        method: jForm.attr('method'),
        url: jForm.attr('action'),
        data: data
    };
    options = defaults(overrides,options);
    const service = new BaseService();
    return service.manager.request<T>(options);
}

export function getServerResponse<T = any>(apiResponse:any):AppResponse<T>|null {
    if(typeof apiResponse === "string"){
        apiResponse = JSON.parse(apiResponse);
    }
    if(typeof apiResponse !== "string") {
        return apiResponse;
    } else {
        return null;
    }
}

export function processResponse<T = any>(apiResponse:AppResponse<T>):AppResponse<T>|null {
    if(apiResponse!==null) {
        if (apiResponse.status) {
            // if (apiResponse.reload) {
            //     window.location.reload();
            // }
            // else if (apiResponse.redirectUrl) {
            //     window.location.href = apiResponse.redirectUrl;
            // }
        }

        // if (apiResponse.message) {
        //     alert(apiResponse.message);
        // }
    }
    return apiResponse;
}

export function submitForm<T = any>(form:any):Promise<AppResponse<T>> {
    return submitFormUsingAjax<AppResponse<T>>(form)
        .then(resp => {
            return processResponse(getServerResponse<T>(resp.data));
        }).then(resp => {
            updateFieldState(extractResponseErrors(resp), form);
            return resp;
        }).catch(error=> {
            if(error.response.status === 422) {
                updateFieldState(extractResponseErrors({
                    errors: error.response.data.errors,
                    data: null,
                    // message: error.response.data.message,
                    status: false,
                    // redirectUrl: null,
                    // reload: false
                }), form);
            }
            throw error;
        });
}