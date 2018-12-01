import { FieldsState } from ".";

export interface AppResponse<T>{
    status:boolean
    errors:{[field:string]: string[]}
    data:T
}

export interface ResponseWithState<T> {
    response:AppResponse<T>,
    fieldState:FieldsState
}

export function createResponseWithState() {
    return {
        fieldState: new FieldsState(),
        response: {
            data: null,
            status: true,
            errors: {}
        }
    };
}