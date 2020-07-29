import {
    ValidityState,
    getInitializedValidityState,
    ValidityStateManager
} from "js/types";
import { isNumber, toNumber } from "custom-hooks";

export type ValidationRules<T extends string> = Partial<
    Record<T, InputValidationRule[]>
>;

export enum Validations {
    REQUIRED = "required",
    EMAIL = "email",
    // DATE = "date",
    NUMBER = "number",
    MIN = "min",
    MAX = "max"
}

export interface InputValidationRule {
    rule: Validations;
    message?: string;
    options?: any;
}

export interface RuleDefinition {
    validate: (value: any, options: any) => boolean;
    formatMessage: (
        message: string,
        fieldName: string,
        value: any,
        options: any
    ) => string;
}

const validators: { [index in Validations]: RuleDefinition } = {
    [Validations.EMAIL]: {
        validate: (str: string) => {
            const mailFormat = RegExp(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
            if (str && mailFormat.exec(str)) {
                return true;
            } else {
                return false;
            }
        },
        formatMessage: (message, fieldName, value, option) =>
            message ? message : `Entered email is invalid`
    },
    [Validations.NUMBER]: {
        validate: (str: any, options) => {
            const requiredPass = validators[Validations.REQUIRED].validate(
                str,
                options
            );
            if (!requiredPass || isNumber(str)) {
                return true;
            } else {
                return false;
            }
        },
        formatMessage: (message, fieldName, value, option) =>
            message ? message : `Not a number`
    },
    [Validations.MIN]: {
        validate: (str: any, options: any) => {
            const requiredPass = validators[Validations.REQUIRED].validate(
                str,
                options
            );
            const { value = 0 } = options;
            if (!requiredPass || (isNumber(str) && toNumber(str) >= value)) {
                return true;
            } else {
                return false;
            }
        },
        formatMessage: (message, fieldName, value, option) =>
            message ? message : `Value not allowed`
    },
    [Validations.MAX]: {
        validate: (str: any, options: any) => {
            const requiredPass = validators[Validations.REQUIRED].validate(
                str,
                options
            );
            const { value = Infinity } = options;
            if (!requiredPass || (isNumber(str) && toNumber(str) <= value)) {
                return true;
            } else {
                return false;
            }
        },
        formatMessage: (message, fieldName, value, option) =>
            message ? message : `Value not allowed`
    },
    [Validations.REQUIRED]: {
        validate: value =>
            !!(
                value !== undefined &&
                value !== null &&
                value.toString().trim().length > 0
            ),
        formatMessage: (message, fieldName, value, option) =>
            message ? message : `${fieldName} is required`
    }
    // [Validations.DATE]: {
    //     validate: (value: string) => {
    //         if (value) {
    //             return moment(value, "MM/DD/YYYY", true).isValid();
    //         } else {
    //             return true;
    //         }
    //     },
    //     formatMessage: (message, fieldName, value, option) =>
    //         message ? message : `Entered date is invalid`
    // }
};

export function applyValidations(
    state: ValidityState,
    rules: InputValidationRule[],
    value: any,
    field: string
): ValidityState {
    let isValid = true;
    let stateManager: ValidityStateManager = new ValidityStateManager(state);
    rules.forEach(rule => {
        const options = rule.options || {};
        const result = !validators[rule.rule].validate(value, options);

        if (result) {
            isValid = false;
            stateManager = stateManager.replaceErrors(field, {
                code: rule.rule,
                message: validators[rule.rule].formatMessage(
                    rule.message,
                    field,
                    value,
                    options
                )
            });
        }
    });
    if (isValid) {
        stateManager = stateManager.replaceErrors(field, null);
    }
    return stateManager.state;
}

export function getInitializedValidityStateFromRules(
    rules: ValidationRules<string>,
    values: {
        [index: string]: any;
    },
    initialState: ValidityState = getInitializedValidityState([], [])
) {
    let state = initialState;
    for (const k of Object.keys(rules)) {
        state = applyValidations(state, rules[k], values[k], k);
    }
    return state;
}
