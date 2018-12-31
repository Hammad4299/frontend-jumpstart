import React, { ReactNode } from 'react';
import { DialogActions, Dialog, DialogContent,DialogTitle,DialogContentText, createStyles, Theme, WithStyles, Button, StandardProps } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import { AppButton } from 'components';
import { StyleClassKey } from 'typehelper';

const styles = (theme:Theme)=>createStyles({
    actionButton: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    }
});

export type AskConfirmationClassKey = StyleClassKey<typeof styles>

interface State {
    modelOpen:boolean
    confirmationData?:any
}

interface RenderProps {
    askConfirmation:(data?:any)=>void
}

export interface AskConfirmationProps extends StandardProps<{},AskConfirmationClassKey>{
    dialogTitle:string
    dialogMessage:string
    dialogActions?:(dismiss:()=>void, confirm:(data?:any)=>void)=>ReactNode
    onConfirm:(data?:any)=>void
    render:(renderProps:RenderProps)=>ReactNode
}

const decorator = withStyles(styles);

class Component extends React.PureComponent<AskConfirmationProps, State> {
    constructor(props:AskConfirmationProps){
        super(props);
        this.state = {
            modelOpen: false,
            confirmationData: null
        }
    }

    render() {
        const {dialogTitle, dialogMessage, dialogActions, classes, onConfirm = ()=>{}, render = (renderProps:RenderProps)=>null} = this.props;
        const {
            actionButton, 
            ...restclasses
        } = classes;

        const confirm = (e:any)=>{
            onConfirm(this.state.confirmationData)
            this.setState({modelOpen: false})
        };
        const dismiss = ()=>this.setState({modelOpen:false});

        const dialog = this.state.modelOpen && (
            <Dialog onClick={(e)=>e.stopPropagation()} open={this.state.modelOpen}
                onClose={()=>{this.setState({modelOpen:false})}}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {dialogActions ? dialogActions(dismiss, confirm) : (
                        <React.Fragment>
                            <AppButton className={actionButton} onClick={confirm}>Yes</AppButton>
                            <AppButton className={actionButton} onClick={dismiss}>No</AppButton>
                        </React.Fragment>
                    )}
                </DialogActions>
            </Dialog>);
        
        return (
            <React.Fragment>
                {dialog}
                {render({
                    askConfirmation: (data:any)=>this.setState({modelOpen:true,confirmationData: data})
                })}
            </React.Fragment>
        );
    }
}

export const AskConfirmation = decorator(Component);
export default AskConfirmation;