import * as React from "react";
import { createStyles, withStyles, Theme, StandardProps, DialogContent } from "@material-ui/core";
import { StyleClassKey } from "typehelper";
import classNames from "classnames";
import { DialogContentProps } from "@material-ui/core/DialogContent";

const styles = (theme:Theme) => createStyles({
    root: {
        padding: theme.spacing.unit*2,
    
    },
    body: {
        overflowY: 'visible'
    }
});

const decorator = withStyles(styles);

export interface AppDialogContentProps extends StandardProps<DialogContentProps, StyleClassKey<typeof styles>> {
    scroll?:'body'|'paper'
    children:React.ReactNode
}

const Component = ({ scroll = 'body', className, children, classes: {body, root, ...restClasses}, ...rest }:AppDialogContentProps) => {
    return (
        <DialogContent className={classNames(root, className, {
            [body]: scroll === 'body'
        })} classes={restClasses} {...rest}>
            {children}
        </DialogContent>
    )
}

Component.defaultProps = {
    scroll: 'body'
} as AppDialogContentProps

Component.displayName = 'AppDialogContent';

export const AppDialogContent = decorator(
    Component
)

export default AppDialogContent;