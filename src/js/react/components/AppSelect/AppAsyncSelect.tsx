import CustomSelect from "./CustomSelect";
import { SimpleOption, ComposedSelect, AsyncSelectProps } from "./types";
import React from "react";
import Async from "react-select/async";
import { GroupBase } from "react-select/dist/declarations/src/types";

export type AppAsyncSelectProps<
    OptionType = SimpleOption,
    isMulti extends boolean = boolean,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> = ComposedSelect<
    AsyncSelectProps<OptionType, isMulti, Group>,
    OptionType,
    isMulti,
    Group
>;

function Component(props: AppAsyncSelectProps) {
    return <CustomSelect {...props} Component={Async} />;
}

export const AppAsyncSelect = Component;
export default AppAsyncSelect;
