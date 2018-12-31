import { StandardProps} from "@material-ui/core";
import CustomSelect, { CustomSelectProps, CustomSelectClassKey } from "./CustomSelect";
import { SimpleOption } from "./types";
import { Props } from "react-select/lib/Select";
import AsyncCreatable from "react-select/lib/AsyncCreatable";
import { AsyncProps } from "react-select/lib/Async";
import { CreatableProps } from "react-select/lib/Creatable";

export type AppAsyncCreatableSelectClassKey = CustomSelectClassKey;

export interface AppAsyncCreatableSelectProps<OptionType = SimpleOption> extends StandardProps<CustomSelectProps<AsyncProps<OptionType> & CreatableProps<OptionType> & Props<OptionType>,OptionType>, AppAsyncCreatableSelectClassKey,'Component'> {
}

function Component(props:AppAsyncCreatableSelectProps) {
    return (
        <CustomSelect Component={AsyncCreatable} {...props} />
    )
}


export const AppAsyncCreatableSelect = Component;
export default AppAsyncCreatableSelect;