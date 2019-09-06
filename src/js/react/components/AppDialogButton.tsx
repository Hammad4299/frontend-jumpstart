import React from "react"
import { Theme, StandardProps } from "@material-ui/core"
import { ButtonProps } from "@material-ui/core/Button"
import { createStyles, makeStyles } from "@material-ui/styles"
import { StyleClassKey } from "../typescript"
import { AppButton, AppButtonProps } from "./"

const styles = (theme: Theme) => createStyles({})

type AppDialogButtonClassKey = StyleClassKey<typeof styles>
const useStyles = makeStyles(styles)

export interface AppDialogButtonProps
    extends StandardProps<AppButtonProps, AppDialogButtonClassKey> {
    styleVariant?: "dismiss" | "proceed"
}

const Component = (props: AppDialogButtonProps) => {
    const { styleVariant, classes: temp, ...rest } = props
    let color: ButtonProps["color"] = "secondary"
    let variant: ButtonProps["variant"] = "contained"
    const classes = useStyles(props)
    if (styleVariant === "dismiss") {
        color = "primary"
        variant = "text"
    }
    return (
        <AppButton
            color={color}
            variant={variant}
            {...rest}
            classes={classes}
        />
    )
}
Component.displayName = "AppDialogButton"
Component.defaultProps = {
    styleVariant: "proceed",
} as AppDialogButtonProps

export const AppDialogButton = Component
export default AppDialogButton
