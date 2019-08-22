import React from "react";
import {Theme, StandardProps} from "@material-ui/core";
import {ButtonProps} from "@material-ui/core/Button";
import { withStyles, createStyles }from "@material-ui/styles";
import { StyleClassKey, StylesType } from "typehelper";
import { AppButtonClassKey, AppButton, AppButtonProps } from "components";

const styles = (theme:Theme) => createStyles({
});

type AppDialogButtonClassKey = StyleClassKey<typeof styles>|AppButtonClassKey

const finalStyles:StylesType<AppDialogButtonClassKey> = styles as any;

const decorator = withStyles(finalStyles);

export interface AppDialogButtonProps extends StandardProps<AppButtonProps, AppDialogButtonClassKey> {
    styleVariant?:'dismiss'|'proceed'
}

const Component = ({ styleVariant ,...rest}:AppDialogButtonProps) => {
    let color:ButtonProps['color'] = 'secondary';
    let variant:ButtonProps['variant'] = 'contained';
    if(styleVariant === 'dismiss') {
        color = 'primary';
        variant = 'text';
    }
    return (
        <AppButton color={color} variant={variant} {...rest} />
    )
}

Component.defaultProps = {
    styleVariant: 'proceed'
} as AppDialogButtonProps
Component.displayName = 'AppDialogButton'

export const AppDialogButton = decorator(
    Component
)

export default AppDialogButton;