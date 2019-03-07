import React from 'react';
import { AppBar, Tabs, createStyles, Theme, withStyles, StandardProps } from "@material-ui/core";
import { TabsProps, TabsClassKey } from '@material-ui/core/Tabs';
import { AppBarProps } from '@material-ui/core/AppBar';
import { StyleClassKey, StylesType } from 'typehelper';

const styles = (theme:Theme) => createStyles({
    appbar: {
        background: theme.palette.background.paper
    }
});

export type AppTabsClassKey = StyleClassKey<typeof styles>|TabsClassKey

export interface AppTabsProps extends StandardProps<TabsProps,AppTabsClassKey>{
    appBarProps?:AppBarProps
}

const decorator = withStyles(styles as StylesType<AppTabsClassKey>);

function Component(props:AppTabsProps) {
    const {classes, appBarProps, children, ...rest} = props;
    return (
        <AppBar position="static" className={classes.appbar} {...appBarProps}>
            <Tabs
                indicatorColor="primary"
                textColor="primary"
                {...rest}
            >
                {children}
            </Tabs>
        </AppBar>
    )
}

Component.defaultProps = {
    appBarProps: {
        elevation: 0
    }
} as AppTabsProps

Component.displayName = 'AppTabs'

export const AppTabs = decorator(Component);
export default AppTabs;