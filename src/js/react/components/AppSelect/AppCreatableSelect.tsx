import CustomSelect, { CustomSelectClassKey } from "./CustomSelect";
import { SimpleOption, CreatableSelectProps, ComposedSelect } from "./types";
import React from "react";
import Creatable from "react-select/creatable";
import { GroupBase } from "react-select/dist/declarations/src/types";

export type AppCreatableSelectProps<
    OptionType = SimpleOption,
    isMulti extends boolean = boolean,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> = ComposedSelect<
    CreatableSelectProps<OptionType, isMulti, Group>,
    OptionType,
    isMulti,
    Group
>;
export type AppSelectClassKey = CustomSelectClassKey;

function Component(props: AppCreatableSelectProps) {
    return <CustomSelect {...props} Component={Creatable} />;
}

export const AppCreatableSelect = Component;
export default AppCreatableSelect;
