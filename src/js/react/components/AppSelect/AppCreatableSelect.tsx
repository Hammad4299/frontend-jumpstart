import React from 'react';
import CustomSelect from "./CustomSelect";
import { SimpleOption, CreatableSelectProps, ComposedSelect } from "./types";
import Creatable from "react-select/lib/Creatable";

export type AppCreatableSelectProps<OptionType = SimpleOption> = ComposedSelect<CreatableSelectProps<OptionType>,OptionType>;

function Component(props:AppCreatableSelectProps) {
    return (
        <CustomSelect {...props} Component={Creatable} />
    )
}

export const AppCreatableSelect = Component;
export default AppCreatableSelect;