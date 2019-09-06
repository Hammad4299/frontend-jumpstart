import * as React from "react"
import { Theme, Toolbar, IconButton, StandardProps } from "@material-ui/core"
import { Close as CloseIcon } from "@material-ui/icons"
import { withStyles, createStyles } from "@material-ui/styles"
import { ToolbarProps } from "@material-ui/core/Toolbar"
import { StyleClassKey } from "../typescript"
import classNames from "classnames"

const styles = (theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            padding: theme.spacing(1),
            borderBottom: `solid 1px ${theme.palette.grey["200"]}`,
        },
        closeIcon: {
            marginLeft: "auto",
            justifyContent: "flex-end",
        },
    })

const decorator = withStyles(styles)

export interface AppDialogHeaderProps
    extends StandardProps<ToolbarProps, StyleClassKey<typeof styles>> {
    onClose?: () => void
}

const Component = ({
    onClose = () => {},
    classes,
    children,
    className,
    ...rest
}: AppDialogHeaderProps) => {
    return (
        <Toolbar className={classNames(classes.root, className)} {...rest}>
            {children}
            <IconButton
                color="inherit"
                onClick={() => onClose()}
                aria-label="Close"
                className={classes.closeIcon}
            >
                <CloseIcon />
            </IconButton>
        </Toolbar>
    )
}

Component.defaultProps = {
    onClose: () => {},
} as AppDialogHeaderProps

Component.displayName = "AppDialogHeader"

export const AppDialogHeader = decorator(Component)

export default AppDialogHeader
