import * as React from "react";
import {Theme, StandardProps, Typography} from "@material-ui/core";
import { withStyles, createStyles }from "@material-ui/styles";
import { StyleClassKey } from "typehelper";

const styles = (theme:Theme) => createStyles({
    root: {
        fontWeight: 'bold',
        fontSize: '1.1rem',
        padding: 0
    }
});

const decorator = withStyles(styles);

export interface AppDialogTitleProps extends StandardProps<{}, StyleClassKey<typeof styles>> {
    children:string
}

const Component = ({ classes, children, ...rest }:AppDialogTitleProps) => {
    return (
        <Typography className={classes.root}>
            {children}
        </Typography>
    )
}

Component.displayName = 'AppDialogTitle'

export const AppDialogTitle = decorator(
    Component
)

export default AppDialogTitle;