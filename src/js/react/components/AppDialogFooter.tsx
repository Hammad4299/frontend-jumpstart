import * as React from "react";
import {Theme, StandardProps} from "@material-ui/core";
import { withStyles, createStyles }from "@material-ui/styles";
import { StyleClassKey } from "../typescript";
import classNames from "classnames";

const styles = (theme:Theme) => createStyles({
    root: {
        padding: theme.spacing(1),
        borderTop: `solid 1px ${theme.palette.grey["200"]}`
    }
});

const decorator = withStyles(styles);

export interface AppDialogFooterProps extends StandardProps<{}, StyleClassKey<typeof styles>, never, false> {
    children:React.ReactNode
}

const Component = ({ classes, children, className, ...rest }:AppDialogFooterProps) => {
    return (
        <div className={classNames(classes.root, className)} {...rest}>
            {children}
        </div>
    )
}

Component.displayName = 'AppDialogFooter';

export const AppDialogFooter = decorator(
    Component
)

export default AppDialogFooter;