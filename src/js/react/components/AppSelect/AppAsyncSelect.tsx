import { StandardProps} from "@material-ui/core";
import CustomSelect, { CustomSelectProps, CustomSelectClassKey } from "./CustomSelect";
import { SimpleOption } from "./types";
import { Props } from "react-select/lib/Select";
import Async, { AsyncProps } from "react-select/lib/Async";

export type AppAsyncSelectClassKey = CustomSelectClassKey;

export interface AppAsyncSelectProps<OptionType = SimpleOption> extends StandardProps<CustomSelectProps<AsyncProps<OptionType> & Props<OptionType>,OptionType>, AppAsyncSelectClassKey,'Component'> {
}

function Component(props:AppAsyncSelectProps) {
    return (
        <CustomSelect Component={Async} {...props} />
    )
}


export const AppAsyncSelect = Component;
export default AppAsyncSelect;

