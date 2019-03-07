import { defaultTo } from "lodash-es";

export interface ErrorInfo {
    hasError:boolean,
    errors:string[]
    error:string|null
}

export type ValidityState = {[field:string]:ErrorInfo};

export function getInitializedValidityState(state:Readonly<ValidityState>,field:Readonly<string|string[]>) {
    state = defaultTo(state, {});
    let initialized = {...state};
    if(typeof field === 'string'){
        initialized = getInitializedValidityState(initialized,[field]);
    } else {
        field.forEach((f)=>{
            if(!initialized[f]) {
                initialized[f] = {
                    error: null,
                    errors: [],
                    hasError: false
                };
            }
        })
    }
    return initialized;
}

export function getErrorInfo(state:Readonly<ValidityState>, field:Readonly<string>) {
    return getInitializedValidityState(state,field)[field];
}

export function isStateValid(state:Readonly<ValidityState>):boolean {
    state = defaultTo(state, {});
    for(const key in state) {
        if(state.hasOwnProperty(key) && state[key].hasError) {
            return false;
        }
    }
    return true;
}

export function getFirstErrorFor(validityState:Readonly<ValidityState>, fields:Readonly<string[]>) {
    let info:ErrorInfo = null;
    fields.forEach((field)=>{
        if(!info || !info.hasError) {
            info = getErrorInfo(validityState, field);
        }
    });

    return info;
}

export function addError(validityState:Readonly<ValidityState>, field:Readonly<string>, error:Readonly<string>) {
    const s = getInitializedValidityState(validityState, field);
    s[field].error = error;
    s[field].hasError = true;
    s[field].errors.push(error);
    return s;
}

export function setErrors(validityState:Readonly<ValidityState>, field:Readonly<string>, errors:Readonly<string[]>) {
    const s = getInitializedValidityState(validityState, field);
    s[field].hasError = errors.length>0;
    s[field].error = errors.length>0 ? errors[0]  : null;
    s[field].errors = errors;
    return s;
}