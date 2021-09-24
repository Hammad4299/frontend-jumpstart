import { CustomSelectClassKey, CustomSelectProps } from "./CustomSelect";
import { AsyncProps } from "react-select/async";
import { CreatableProps } from "react-select/creatable";
import { Props } from "react-select/dist/declarations/src/Select";
import { GroupBase } from "react-select/dist/declarations/src/types";
import { FixedSizeListProps } from "react-window";
import { Subtract } from "utility-types";

export interface CustomSelectComponentSelectProps {
    classes: Partial<Record<CustomSelectClassKey, string>>;
    controlProps: {
        fullWidth: boolean;
        allowReload: boolean;
        onReload: () => void;
    };
    fixedSizeListProps: FixedSizeListProps;
}

export type SelectComponentProps<ComponentProps> = Pick<
    ComponentProps,
    Exclude<keyof ComponentProps, "selectProps">
> & {
    selectProps: CustomSelectComponentSelectProps;
};

export interface SimpleOption {
    [index: string]: any;
    label?: string | number;
    value?: any;
}

export type SelectProps<
    OptionType,
    isMulti extends boolean = boolean,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> = Props<OptionType, isMulti, Group>;
export type AsyncSelectProps<
    OptionType,
    isMulti extends boolean = boolean,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> = AsyncProps<OptionType, isMulti, Group> & Props<OptionType, isMulti, Group>;
export type CreatableSelectProps<
    OptionType,
    isMulti extends boolean = boolean,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> = CreatableProps<OptionType, isMulti, Group> &
    Props<OptionType, isMulti, Group>;
export type AsyncCreatableSelectProps<
    OptionType,
    isMulti extends boolean = boolean,
    Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> = AsyncProps<OptionType, isMulti, Group> &
    CreatableProps<OptionType, isMulti, Group> &
    Props<OptionType, isMulti, Group>;

export type ComposedSelect<
    TProps extends Props<TOption, isMulti, Group>,
    TOption,
    isMulti extends boolean = boolean,
    Group extends GroupBase<TOption> = GroupBase<TOption>,
> = Subtract<
    CustomSelectProps<TProps, TOption, isMulti, Group>,
    {
        Component;
    }
>;
