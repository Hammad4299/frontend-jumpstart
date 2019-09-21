import * as React from "react";
import { Switch, Theme, StandardProps } from "@material-ui/core";
import { SwitchProps, SwitchClassKey } from "@material-ui/core/Switch";
import { withStyles, createStyles } from "@material-ui/styles";
import { StyleClassKey, StylesType } from "../typescript";

const styles = (theme: Theme) =>
    createStyles({
        switchBase: {
            "&$checked": {
                color: theme.palette.common.white,
                "& + $track": {
                    backgroundColor: theme.palette.primary.main
                },
                "& $thumb": {
                    boxShadow: theme.shadows[1]
                }
            },
            transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
                easing: theme.transitions.easing.sharp
            })
        },
        checked: {
            transform: "translateX(15px)",
            "& + $track": {
                opacity: 1,
                border: "none"
            }
        },
        track: {
            borderRadius: 13,
            width: 42,
            height: 26,
            marginTop: -13,
            marginLeft: -21,
            border: "solid 1px",
            borderColor: theme.palette.grey[400],
            backgroundColor: theme.palette.grey[50],
            opacity: 1,
            transition: theme.transitions.create(["background-color", "border"])
        },
        thumb: {
            width: 24,
            height: 24
        }
    });

type AppSwitchClassKey = StyleClassKey<typeof styles> | SwitchClassKey;

const decorator = withStyles(styles as StylesType<AppSwitchClassKey>);

export interface AppSwitchProps
    extends StandardProps<SwitchProps, AppSwitchClassKey> {}

function Component(props: AppSwitchProps) {
    return <Switch {...props} />;
}
Component.defaultProps = {
    disableRipple: true
} as AppSwitchProps;
Component.displayName = "AppSwitch";
export const AppSwitch = decorator(Component);
export default AppSwitch;
