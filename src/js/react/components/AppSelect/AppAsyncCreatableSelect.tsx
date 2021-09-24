import CustomSelect from "./CustomSelect";
import {
    SimpleOption,
    AsyncCreatableSelectProps,
    ComposedSelect,
} from "./types";
import React from "react";
import AsyncCreatable from "react-select/async-creatable";
import { GroupBase } from "react-select/dist/declarations/src/types";

export type AppAsyncCreatableSelectProps<
    OptionType = SimpleOption,
    isMulti extends boolean = boolean,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> = ComposedSelect<
    AsyncCreatableSelectProps<OptionType, isMulti, Group>,
    OptionType,
    isMulti,
    Group
>;

function Component(props: AppAsyncCreatableSelectProps) {
    return <CustomSelect {...props} Component={AsyncCreatable} />;
}

export const AppAsyncCreatableSelect = Component;
export default AppAsyncCreatableSelect;
