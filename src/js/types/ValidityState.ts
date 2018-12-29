import { isString } from "util";

export interface ErrorInfo {
    hasError:boolean,
    errors:string[]
    error:string|null
}

export type ValidityState = {[field:string]:ErrorInfo};

export function initValidityStateImpure(state:ValidityState,field:string|string[]) {
    if(isString(field)){
        initValidityStateImpure(state,[field]);
    } else {
        field.forEach((f)=>{
            if(!state[f]) {
                state[f] = {
                    error: null,
                    errors: [],
                    hasError: false
                };
            }
        })
    }
    return state;
}

export function getErrorInfo(state:ValidityState, field:string) {
    initValidityStateImpure(state,field);
    return state[field];
}

export function validityStateValid(state:ValidityState):boolean {
    for(const key in state) {
        if(state.hasOwnProperty(key) && state[key].hasError) {
            return false;
        }
    }
    return true;
}

export function getFirstErrorFor(validityState:ValidityState, fields:string[]) {
    let info:ErrorInfo = null;
    fields.forEach((field)=>{
        if(!info || !info.hasError) {
            info = getErrorInfo(validityState, field);
        }
    });

    return info;
}

export function addError(validityState:ValidityState, field:string, error:string) {
    initValidityStateImpure(validityState, field);
    validityState[field].error = error;
    validityState[field].hasError = true;
    validityState[field].errors.push(error);
}

export function setErrors(validityState:ValidityState, field:string, errors:string[]) {
    initValidityStateImpure(validityState, field);
    validityState[field].hasError = errors.length>0;
    validityState[field].error = errors.length>0 ? errors[0]  : null;
    validityState[field].errors = errors;
}