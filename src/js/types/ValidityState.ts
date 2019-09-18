import { defaultTo } from "lodash-es";

export interface ErrorInfo {
    hasError: boolean;
    errors: string[];
    error: string | null;
}

export type ValidityState<X extends string | number | symbol = any> =
    | Partial<Record<X, Partial<ErrorInfo>>>
    | Record<any, Partial<ErrorInfo>>;

export function getInitializedValidityState<
    X extends string | number | symbol = any
>(state: Readonly<ValidityState<X>>, field: Readonly<string | string[]>) {
    state = defaultTo(state, {} as ValidityState<X>);
    let initialized: ValidityState<X> = { ...state };
    if (typeof field === "string") {
        initialized = getInitializedValidityState<X>(initialized, [field]);
    } else {
        field.forEach(f => {
            if (!initialized[f]) {
                initialized[f] = {
                    error: null,
                    errors: [],
                    hasError: false
                };
            }
        });
    }
    return initialized;
}

export function getErrorInfo<X extends string | number | symbol = any>(
    state: Readonly<ValidityState<X>>,
    field: Readonly<string>
) {
    return getInitializedValidityState(state, field)[field];
}

export function isStateValid<X extends string | number | symbol = any>(
    state: Readonly<ValidityState<X>>
): boolean {
    state = defaultTo<ValidityState<X>>(state, {} as ValidityState<X>);
    for (const key in state) {
        if (
            Object.prototype.hasOwnProperty.call(state, key) &&
            state[key].hasError
        ) {
            return false;
        }
    }
    return true;
}

export function getFirstErrorFor<X extends string | number | symbol = any>(
    validityState: Readonly<ValidityState<X>>,
    fields: Readonly<string[]>
) {
    let info: ErrorInfo = null;
    fields.forEach(field => {
        if (!info || !info.hasError) {
            info = getErrorInfo(validityState, field);
        }
    });

    return info;
}

export function addError<X extends string | number | symbol = any>(
    validityState: Readonly<ValidityState<X>>,
    field: Readonly<string>,
    error: Readonly<string>
) {
    const s = getInitializedValidityState(validityState, field);
    s[field].error = error;
    s[field].hasError = true;
    s[field].errors.push(error);
    return s;
}

export function setErrors<X extends string | number | symbol = any>(
    validityState: Readonly<ValidityState<X>>,
    field: Readonly<string>,
    errors: string[]
) {
    const s = getInitializedValidityState(validityState, field);
    s[field].hasError = errors.length > 0;
    s[field].error = errors.length > 0 ? errors[0] : null;
    s[field].errors = errors;
    return s;
}
