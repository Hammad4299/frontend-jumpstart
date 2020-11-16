import {
    ValidityState,
    getInitializedValidityState,
    ValidityStateManager
} from "./ValidityState";

export interface AppResponse<T> {
    status: boolean;
    errors: { [index: string]: string[] };
    data: T;
}

export type WithValidityState<T, X extends string = never> = {
    [P in keyof T]: T[P];
} & {
    validityState: ValidityState;
};

export function extractResponseErrors<T, X extends string = never>(
    response: AppResponse<T>,
    defaultFields: string[] = []
): ValidityState {
    let toRet = new ValidityStateManager(
        getInitializedValidityState([], defaultFields)
    );
    if (response !== null) {
        for (const field in response.errors) {
            if (Object.prototype.hasOwnProperty.call(response.errors, field)) {
                const errArr = response.errors[field];
                toRet = toRet.replaceFieldState(field, {
                    identifier: field,
                    children: [],
                    errors: errArr.map(x => ({
                        code: x,
                        message: x
                    }))
                });
            }
        }
    }

    return toRet.state;
}
