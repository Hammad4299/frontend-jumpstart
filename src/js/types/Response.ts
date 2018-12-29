import { ValidityState } from "types";
import { initValidityStateImpure, setErrors } from "./ValidityState";

export interface AppResponse<T> {
    status:boolean
    errors:{[field:string]: string[]}
    data:T
}

export type WithValidityState<T> = {
    [P in keyof T]: T[P]
} & {
    validityState:ValidityState
};

export function extractResponseErrors<T>(response:AppResponse<T>, defaultFields:string[] = []):ValidityState {
    let toRet:ValidityState = initValidityStateImpure({},defaultFields);
    if(response!==null){
        for(const field in response.errors) {
            if(response.errors.hasOwnProperty(field)){
                const errArr = response.errors[field];
                setErrors(toRet, field, errArr);
            }
        }
    }

    return toRet;
}
