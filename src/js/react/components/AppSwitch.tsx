import * as React from "react";
import {Theme, StandardProps} from "@material-ui/core";
import Switch, {SwitchProps, SwitchClassKey} from "@material-ui/core/Switch";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { StyleClassKey, StylesType } from "typehelper";

const styles = (theme:Theme) => createStyles({
    switchBase: {
        '&$checked': {
            color: theme.palette.common.white,
            '& + $bar': {
                backgroundColor: theme.palette.primary.main,
            },
        },
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.sharp,
        }),
    },
    checked: {
        transform: 'translateX(15px)',
        '& + $bar': {
            opacity: 1,
            border: 'none',
        },
    },
    bar: {
        borderRadius: 13,
        width: 42,
        height: 26,
        marginTop: -13,
        marginLeft: -21,
        border: 'solid 1px',
        borderColor: theme.palette.grey[400],
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    icon: {
        width: 24,
        height: 24,
    },
    iconChecked: {
        boxShadow: theme.shadows[1],
    },
});

type AppSwitchClassKey = StyleClassKey<typeof styles>|SwitchClassKey;

const decorator = withStyles(styles as StylesType<AppSwitchClassKey>);

export interface AppSwitchProps extends StandardProps<SwitchProps, AppSwitchClassKey> {
}

function Component(props:AppSwitchProps) {
    return (
        <Switch disableRipple {...props} />
    )
}

export const AppSwitch = decorator(Component);
export default AppSwitch;