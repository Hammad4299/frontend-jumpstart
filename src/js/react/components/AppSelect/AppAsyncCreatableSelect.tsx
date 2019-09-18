import React from "react";
import CustomSelect from "./CustomSelect";
import {
    SimpleOption,
    AsyncCreatableSelectProps,
    ComposedSelect
} from "./types";
import AsyncCreatable from "react-select/async-creatable";

export type AppAsyncCreatableSelectProps<
    OptionType = SimpleOption
> = ComposedSelect<AsyncCreatableSelectProps<OptionType>, OptionType>;

function Component(props: AppAsyncCreatableSelectProps) {
    return <CustomSelect {...props} Component={AsyncCreatable} />;
}

export const AppAsyncCreatableSelect = Component;
export default AppAsyncCreatableSelect;
