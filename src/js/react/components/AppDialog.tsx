import React from "react";
import { Dialog, Theme, StandardProps } from "@material-ui/core";
import { DialogProps } from "@material-ui/core/Dialog";
import { createStyles, makeStyles } from "@material-ui/styles";
import { StyleClassKey } from "../typescript";

const styles = (theme:Theme) => createStyles({
    paper: {
        maxWidth: '95vw',
        overflowY: 'visible',
        marginTop: (theme.spacing(3)+parseInt(theme.header.height.toString()))
    },
    scrollBody: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    }
});

type AppDialogClassKey = StyleClassKey<typeof styles>

let useStyles = makeStyles(styles);

export interface AppDialogProps extends StandardProps<DialogProps, AppDialogClassKey> {
}

function Component(props:AppDialogProps) {
    let classes = useStyles(props);
    return (
        <Dialog {...props} classes={classes} />
    )
}

Component.defaultProps = {
    scroll: 'body'
} as AppDialogProps
Component.displayName = 'AppDialog';
export let AppDialog = Component;
export default AppDialog;