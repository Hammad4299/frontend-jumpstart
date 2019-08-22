import * as React from "react";
import {Theme, StandardProps, Typography} from "@material-ui/core";
import { withStyles, createStyles }from "@material-ui/styles";
import { StyleClassKey } from "typehelper";
import classNames from "classnames";

const styles = (theme:Theme) => createStyles({
    root: {
        color: theme.palette.text.hint,
        fontSize: '0.8rem'
    }
});

const decorator = withStyles(styles);

export interface AppDialogSubtitleProps extends StandardProps<{}, StyleClassKey<typeof styles>> {
    children:string
}

const Component = ({ classes, children, ...rest }:AppDialogSubtitleProps) => {
    return (
        <Typography className={classes.root} variant={'subtitle1'}>
            {children}
        </Typography>
    )
}

Component.displayName = 'AppDialogSubtitle';

export const AppDialogSubtitle = decorator(
    Component
)

export default AppDialogSubtitle;