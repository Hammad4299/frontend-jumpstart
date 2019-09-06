import {
    ValidityState,
    getInitializedValidityState,
    setErrors,
} from "./ValidityState"

export interface AppResponse<T> {
    status: boolean
    errors: { [index: string]: string[] }
    data: T
}

export type WithValidityState<T, X extends string = never> = {
    [P in keyof T]: T[P]
} & {
    validityState: ValidityState<X>
}

export function extractResponseErrors<T, X extends string = never>(
    response: AppResponse<T>,
    defaultFields: string[] = []
): ValidityState<X> {
    let toRet: ValidityState<X> = getInitializedValidityState<X>(
        null,
        defaultFields
    )
    if (response !== null) {
        for (const field in response.errors) {
            if (Object.prototype.hasOwnProperty.call(response.errors, field)) {
                const errArr = response.errors[field]
                toRet = setErrors<X>(toRet, field, errArr)
            }
        }
    }

    return toRet
}
