export * from "./breadcrumb";
export * from "./routing";
import { useState, useEffect } from "react";
import numeral from "numeral";

export function isNumber(value: any) {
    if (value != null) {
        if (!isNaN(parseFloat(value))) {
            return true;
        } else {
            //Numeral.validate returns false for negative values
            return numeral.validate(value.toString(), numeral.locale());
        }
    } else {
        return false;
    }
}
export function toNumber(value: any) {
    return numeral(value).value();
}

export function useNumberInput(
    onChangeValue: (value: number) => void,
    defaultValue = 0,
    options: {
        format: string;
    } = { format: "0,0.00" }
) {
    const [textState, setTextState] = useState(
        !isNumber(defaultValue)
            ? ""
            : numeral(defaultValue).format(options.format)
    );

    const toNum = (value: string) => {
        return isNumber(value) ? numeral(value).value() : null;
    };

    const onInputChange = (value: string) => {
        if (value == null) {
            value = "";
        }
        value = value.trim();
        const num = toNum(value);
        onChangeValue(num);
        return num;
    };

    // useEffect(() => {
    //     onChangeValue(toNum(textState));
    // }, [textState]);

    return {
        inputValue: textState,
        setDefaultValue: (val: any) => {
            if (!isNumber(defaultValue)) {
                val = "";
                setTextState(val);
            } else {
                setTextState(numeral(val).format(options.format));
            }
        },
        onInputChange,
        value: toNum(textState)
    };
}
