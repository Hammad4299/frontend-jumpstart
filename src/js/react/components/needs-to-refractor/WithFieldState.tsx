import React, { ReactNode } from "react";
import {Theme, WithStyles, FormControl, FormHelperText, InputLabel} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import IErrorInfo from "interfaces/IErrorInfo";
import { FormControlProps } from "@material-ui/core/FormControl";
import { FormHelperTextProps } from "@material-ui/core/FormHelperText";
import { InputLabelProps } from "@material-ui/core/InputLabel";
import classNames from "classnames";

const styles = (theme:Theme) => createStyles({
    hasLabel: {
        marginTop: theme.spacing.unit*2
    }
});

interface WithFieldStateProps extends FormControlProps{
    errorInfo?:IErrorInfo
    inputLabelProps?:InputLabelProps
    helperTextProps?:FormHelperTextProps
    renderProps?:()=>ReactNode
    showHelper?:boolean
    labelMargin?:boolean
    showLabel?:boolean
}

type StyledProps = WithFieldStateProps & WithStyles<typeof styles>;
const decorator = withStyles(styles);

function WithFieldState({
        classes,
        labelMargin = false,
       renderProps = ()=>null,
       showLabel = true,
       inputLabelProps,
       errorInfo = {
           errors: [],
           error: null,
           hasError:false
        }, helperTextProps = {}, 
        showHelper = null,
        ...rest
    }:StyledProps) {

    if(showHelper === null){
        showHelper = errorInfo.hasError;
    }

    return (
        <FormControl margin={'dense'} error={errorInfo.hasError} {...rest}>
            {showLabel && <InputLabel {...inputLabelProps} />}
            <span className={classNames({
                    [classes.hasLabel]: labelMargin
                })
            }>
                {renderProps()}
            </span>
            {showHelper && <FormHelperText {...helperTextProps}>{errorInfo.error ? errorInfo.error : helperTextProps.children}</FormHelperText>}
        </FormControl>
    )
}

export default decorator(WithFieldState);