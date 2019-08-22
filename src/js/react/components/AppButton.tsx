import React from "react";
import { Theme, StandardProps, Button } from "@material-ui/core";
import { createStyles, makeStyles } from '@material-ui/styles'
import { ButtonProps } from "@material-ui/core/Button";
import { StyleClassKey } from "typehelper";

const styles = (theme:Theme) => createStyles({
})

export type AppButtonClassKey = StyleClassKey<typeof styles>

const useStyles = makeStyles(styles);

export interface AppButtonProps extends StandardProps<ButtonProps, AppButtonClassKey> {
}

function Component(props:AppButtonProps) {
    let classes = useStyles(props);
    
    return (
        <Button {...props}  />
    )
}

Component.displayName = 'AppButton';

Component.defaultProps = {
    color: 'primary',
    variant: 'contained'
} as AppButtonProps
export let AppButton = Component;
export default AppButton;