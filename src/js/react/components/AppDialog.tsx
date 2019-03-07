import React from "react";
import {Theme, StandardProps} from "@material-ui/core";
import {DialogProps} from "@material-ui/core/Dialog";
import Dialog, { DialogClassKey } from "@material-ui/core/Dialog/Dialog";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { StyleClassKey, StylesType } from "typehelper";

const styles = (theme:Theme) => createStyles({
    paper: {
        maxWidth: '95vw',
        overflowY: 'visible',
        marginTop: (theme.spacing.unit*3)+parseInt(theme.header.height.toString())
    },
    scrollBody: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    }
});

type AppDialogClassKey = StyleClassKey<typeof styles>|DialogClassKey

const finalStyles:StylesType<AppDialogClassKey> = styles as any;

const decorator = withStyles(finalStyles);

export interface AppDialogProps extends StandardProps<DialogProps, AppDialogClassKey> {
}

function Component(props:AppDialogProps) {
    return (
        <Dialog {...props} />
    )
}

Component.defaultProps = {
    scroll: 'body'
} as AppDialogProps

Component.displayName = 'AppDialog';

export const AppDialog = decorator(Component);
export default AppDialog;