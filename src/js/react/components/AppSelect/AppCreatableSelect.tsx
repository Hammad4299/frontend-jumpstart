import React from 'react';
import CustomSelect, { CustomSelectClassKey } from "./CustomSelect";
import { SimpleOption, CreatableSelectProps, ComposedSelect } from "./types";
import Creatable from "react-select/lib/Creatable";

export type AppCreatableSelectProps<OptionType = SimpleOption> = ComposedSelect<CreatableSelectProps<OptionType>,OptionType>;
export type AppSelectClassKey = CustomSelectClassKey;

function Component(props:AppCreatableSelectProps) {
    return (
        <CustomSelect {...props} Component={Creatable} />
    )
}

export const AppCreatableSelect = Component;
export default AppCreatableSelect;