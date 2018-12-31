import React from "react";
import {Theme, StandardProps} from "@material-ui/core";
import {ButtonProps} from "@material-ui/core/Button";
import Button, { ButtonClassKey } from "@material-ui/core/Button/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { StyleClassKey, StylesType } from "typehelper";

const styles = (theme:Theme) => createStyles({
});

type AppButtonClassKey = StyleClassKey<typeof styles>|ButtonClassKey

const finalStyles:StylesType<AppButtonClassKey> = styles as any;

const decorator = withStyles(finalStyles);

export interface AppButtonProps extends StandardProps<ButtonProps, AppButtonClassKey> {
}

function Component(props:AppButtonProps) {
    return (
        <Button {...props} />
    )
}

export const AppButton = decorator(Component);
export default AppButton;