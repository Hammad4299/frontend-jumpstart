import { StandardProps} from "@material-ui/core";
import CustomSelect, { CustomSelectProps, CustomSelectClassKey } from "./CustomSelect";
import { SimpleOption } from "./types";
import { Props } from "react-select/lib/Select";
import Creatable, { CreatableProps } from "react-select/lib/Creatable";

export type AppCreatableSelectClassKey = CustomSelectClassKey;

export interface AppCreatableSelectProps<OptionType = SimpleOption> extends StandardProps<CustomSelectProps<CreatableProps<OptionType> & Props<OptionType>,OptionType>, AppCreatableSelectClassKey,'Component'> {
}

function Component(props:AppCreatableSelectProps) {
    return (
        <CustomSelect Component={Creatable} {...props} />
    )
}


export const AppCreatableSelect = Component;
export default AppCreatableSelect;