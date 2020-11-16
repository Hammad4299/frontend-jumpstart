import React from "react";
import { Dialog, Theme, StandardProps } from "@material-ui/core";
import { DialogProps } from "@material-ui/core/Dialog";
import { createStyles, makeStyles } from "@material-ui/styles";
import { StyleClassKey } from "../typescript";

const styles = (theme: Theme) =>
    createStyles({
        paper: {
            maxWidth: "95vw",
            overflowY: "visible",
            marginTop:
                theme.spacing(3) + parseInt(theme.header.height.toString())
        },
        scrollBody: {
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start"
        }
    });

type AppDialogClassKey = StyleClassKey<typeof styles>;

const useStyles = makeStyles(styles);

export interface AppDialogProps
    extends StandardProps<DialogProps, AppDialogClassKey> {}

export function AppDialog(props: AppDialogProps) {
    const classes = useStyles(props);
    return <Dialog {...props} classes={classes} />;
}

AppDialog.defaultProps = {
    scroll: "body"
} as AppDialogProps;
AppDialog.displayName = "AppDialog";

export default AppDialog;
