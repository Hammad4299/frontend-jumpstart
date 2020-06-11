import { defaultTo } from "lodash-es";

export interface ErrorInfo {
    message: string;
    code: string;
}
export interface FieldState {
    children: ValidityState;
    identifier: string;
    errors: ErrorInfo[];
}

export type ValidityState = FieldState[];

export function getInitializedValidityState(
    state: ValidityState,
    identifiers: Readonly<string | string[]>
) {
    state = defaultTo(state, [] as ValidityState);
    if (typeof identifiers === "string") {
        state = getInitializedValidityState(state, [identifiers]);
    } else {
        identifiers.forEach(f => {
            if (!state.find(a => a.identifier === f)) {
                state = [
                    ...state,
                    {
                        children: [],
                        errors: [],
                        identifier: f
                    }
                ];
            }
        });
    }
    return state;
}

export class ValidityStateManager {
    state: ValidityState;
    constructor(state: ValidityState) {
        this.state = state;
    }

    getFieldState(identifier: string) {
        return getInitializedValidityState(this.state, identifier).find(
            a => a.identifier === identifier
        );
    }

    getFirstErrorInfo(identifier: string) {
        return this.getFieldState(identifier).errors[0];
    }

    getErrorInfoForAny(identifiers: Readonly<string[]>) {
        let info: ErrorInfo = null;
        identifiers.forEach(field => {
            if (!info) {
                info = this.getFirstErrorInfo(field);
            }
        });
        return info;
    }

    isStateValid(recursive = true, state: ValidityState = this.state): boolean {
        state = defaultTo<ValidityState>(state, [] as ValidityState);
        return state.reduce((pre, f) => {
            return (
                pre &&
                f.errors.length === 0 &&
                (!recursive || this.isStateValid(recursive, f.children))
            );
        }, true);
    }

    addErrorInfo(identifier: string, error: ErrorInfo) {
        let state = getInitializedValidityState(this.state, identifier);
        state = this.state.map(a => {
            if (a.identifier === identifier && error) {
                return {
                    ...a,
                    errors: [...a.errors, error]
                };
            }
            return a;
        });

        return new ValidityStateManager(state);
    }

    addChildren(identifier: string, childrens: ValidityState) {
        let state = getInitializedValidityState(this.state, identifier);
        state = this.state.map(a => {
            if (a.identifier === identifier && childrens) {
                return {
                    ...a,
                    children: childrens
                };
            }
            return a;
        });

        return new ValidityStateManager(state);
    }

    replaceErrors(identifier: string, error: ErrorInfo) {
        let state = getInitializedValidityState(this.state, identifier);
        state = this.state.map(a => {
            if (a.identifier === identifier) {
                return {
                    ...a,
                    errors: error ? [error] : []
                };
            }
            return a;
        });

        return new ValidityStateManager(state);
    }

    replaceFieldState(identifier: string, fieldState: FieldState) {
        const old = this.state.find(a => a.identifier === identifier);
        let state: ValidityState = this.state;
        if (old !== undefined && old !== null) {
            if (fieldState === null) {
                //delete
                state = state.filter(a => a.identifier !== identifier);
            } else {
                //update
                state = state.map(a => {
                    if (a.identifier === identifier) {
                        return fieldState;
                    }
                    return a;
                });
            }
        } else {
            //add
            state = [...state, fieldState];
        }
        return new ValidityStateManager(state);
    }
}
