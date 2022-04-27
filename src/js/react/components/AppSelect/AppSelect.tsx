import CustomSelect from "./CustomSelect";
import { SimpleOption, SelectProps, ComposedSelect } from "./types";
import React from "react";
import ReactSelect from "react-select";
import { GroupBase } from "react-select/dist/declarations/src";

export type AppSelectProps<
    OptionType = SimpleOption,
    isMulti extends boolean = boolean,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> = ComposedSelect<
    SelectProps<OptionType, isMulti, Group>,
    OptionType,
    isMulti,
    Group
>;

function Component(props: AppSelectProps) {
    return <CustomSelect {...props} Component={ReactSelect} />;
}

export const AppSelect = Component;
export default AppSelect;

