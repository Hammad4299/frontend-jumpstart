import { ValidityState } from "types";
import { getInitializedValidityState, setErrors } from "./ValidityState";

export interface AppResponse<T> {
    status:boolean
    errors:{[field:string]: string[]}
    data:T
}

export type WithValidityState<T, X extends string = never> = {
    [P in keyof T]: T[P]
} & {
    validityState:ValidityState<X>
};

export function extractResponseErrors<T, X extends string = never>(response:AppResponse<T>, defaultFields:string[] = []):ValidityState<X> {
    let toRet:ValidityState<X> = getInitializedValidityState({},defaultFields);
    if(response!==null) {
        for(const field in response.errors) {
            if(response.errors.hasOwnProperty(field)){
                const errArr = response.errors[field];
                toRet = setErrors(toRet, field, errArr);
            }
        }
    }

    return toRet;
}