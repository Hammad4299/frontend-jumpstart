import React from "react"
import SwipeableViews, { SwipeableViewsProps } from "react-swipeable-views"
import { StandardProps } from "@material-ui/core"
import { withStyles, createStyles } from "@material-ui/styles"
import { StyleClassKey } from "typehelper"

const styles = () =>
    createStyles({
        root: {},
    })

export type AppTabsContentClassKey = StyleClassKey<typeof styles>

export interface AppTabsContentProps
    extends StandardProps<SwipeableViewsProps, AppTabsContentClassKey> {}

const decorator = withStyles(styles)

function Component(props: AppTabsContentProps) {
    const { classes, children, ref, ...rest } = props

    return (
        <SwipeableViews className={classes.root} {...rest}>
            {children}
        </SwipeableViews>
    )
}

Component.displayName = "AppTabsContent"
const AppTabsContent = decorator(Component)
export default AppTabsContent
