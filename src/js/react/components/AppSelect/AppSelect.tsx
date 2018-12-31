import { StandardProps} from "@material-ui/core";
import CustomSelect, { CustomSelectProps, CustomSelectClassKey } from "./CustomSelect";
import { SimpleOption } from "./types";
import ReactSelect from 'react-select';
import { Props } from "react-select/lib/Select";

export type AppSelectClassKey = CustomSelectClassKey;

export interface AppSelectProps<OptionType = SimpleOption> extends StandardProps<CustomSelectProps<Props<OptionType>,OptionType>, AppSelectClassKey,'Component'> {
}

function Component(props:AppSelectProps) {
    return (
        <CustomSelect Component={ReactSelect} {...props} />
    )
}


export const AppSelect = Component;
export default AppSelect;