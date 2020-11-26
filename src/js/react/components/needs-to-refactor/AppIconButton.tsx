import React from "react";
import { IconButton, Theme, StandardProps } from "@material-ui/core";
import { withStyles, createStyles } from "@material-ui/styles";
import { StyleClassKey, StylesType } from "../typescript";
import {
    IconButtonProps,
    IconButtonClassKey
} from "@material-ui/core/IconButton";

const styles = (theme: Theme) => createStyles({});

type AppIconButtonClassKey = StyleClassKey<typeof styles> | IconButtonClassKey;

const finalStyles: StylesType<AppIconButtonClassKey> = styles as any;

const decorator = withStyles(finalStyles);

export interface AppIconButtonProps
    extends StandardProps<IconButtonProps, AppIconButtonClassKey> {}

function Component(props: AppIconButtonProps) {
    return <IconButton {...props} />;
}

Component.displayName = "AppIconButton";
export const AppIconButton = decorator(Component);
export default AppIconButton;
