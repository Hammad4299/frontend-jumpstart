import React from 'react';
import CustomSelect from "./CustomSelect";
import { SimpleOption, SelectProps, ComposedSelect } from "./types";
import ReactSelect from 'react-select';

export type AppSelectProps<OptionType = SimpleOption> = ComposedSelect<SelectProps<OptionType>,OptionType>;

function Component(props:AppSelectProps) {
    return (
        <CustomSelect {...props} Component={ReactSelect} />
    )
}

export const AppSelect = Component;
export default AppSelect;