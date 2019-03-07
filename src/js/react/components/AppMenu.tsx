import React from "react";
import {Menu, Theme, StandardProps} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { StyleClassKey, StylesType } from "typehelper";
import { MenuProps, MenuClassKey } from "@material-ui/core/Menu";


const styles = (theme:Theme) => createStyles({
});


type AppMenuClassKey = StyleClassKey<typeof styles>|MenuClassKey


const finalStyles:StylesType<AppMenuClassKey> = styles as any;


const decorator = withStyles(finalStyles);


export interface AppMenuProps extends StandardProps<MenuProps, AppMenuClassKey> {
}


function Component(props:AppMenuProps) {
    return (
        <Menu {...props} />
    )
}

Component.displayName = 'AppMenu';
export const AppMenu= decorator(Component);
export default AppMenu;