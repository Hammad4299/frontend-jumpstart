import { FixedSizeListProps } from "react-window";
import { CustomSelectClassKey } from "./CustomSelect";

export interface CustomSelectComponentSelectProps {
    classes: Partial<Record<CustomSelectClassKey, string>>
    controlProps: {
        fullWidth: boolean,
        allowReload: boolean
        onReload: ()=>void
    },
    fixedSizeListProps: FixedSizeListProps
}

export type SelectComponentProps<ComponentProps> = Pick<ComponentProps,Exclude<keyof ComponentProps,'selectProps'>> & {
    selectProps:CustomSelectComponentSelectProps
};

export interface SimpleOption {
    [index:string]:any
    label:string
    value:any
}