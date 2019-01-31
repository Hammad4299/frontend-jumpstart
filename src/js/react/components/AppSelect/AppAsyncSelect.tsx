import React from 'react';
import CustomSelect from "./CustomSelect";
import { SimpleOption, ComposedSelect, AsyncSelectProps } from "./types";
import Async from "react-select/lib/Async";

export type AppAsyncSelectProps<OptionType = SimpleOption> = ComposedSelect<AsyncSelectProps<OptionType>,OptionType>;

function Component(props:AppAsyncSelectProps) {
    return (
        <CustomSelect {...props} Component={Async} />
    )
}


export const AppAsyncSelect = Component;
export default AppAsyncSelect;

