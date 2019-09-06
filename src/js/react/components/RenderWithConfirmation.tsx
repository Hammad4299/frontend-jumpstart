import React, { ReactNode } from "react"
import {
    DialogActions,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    Theme,
    Button,
    StandardProps,
} from "@material-ui/core"
import { withStyles, createStyles } from "@material-ui/styles"
import { AppButton } from "./"
import { StyleClassKey } from "../typescript"

const styles = (theme: Theme) =>
    createStyles({
        actionButton: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    })

export type RenderWithConfirmationClassKey = StyleClassKey<typeof styles>

interface State {
    modelOpen: boolean
    confirmationData?: any
}

interface RenderProps {
    askConfirmation: (data?: any) => void
}

export interface RenderWithConfirmationProps
    extends StandardProps<{}, RenderWithConfirmationClassKey> {
    dialogTitle: string
    dialogMessage: string
    dialogActions?: (dismiss: () => void, confirm: () => void) => ReactNode
    onConfirm: (data?: any) => void
    children: (renderProps: RenderProps) => ReactNode
}

const decorator = withStyles(styles)

class Component extends React.PureComponent<
    RenderWithConfirmationProps,
    State
> {
    static defaultProps = {
        onConfirm: () => {},
        children: (renderProps: RenderProps) => null,
    } as RenderWithConfirmationProps
    static displayName = "RenderWithConfirmation"

    constructor(props: RenderWithConfirmationProps) {
        super(props)
        this.state = {
            modelOpen: false,
            confirmationData: null,
        }
    }

    render() {
        const {
            dialogTitle,
            dialogMessage,
            dialogActions,
            classes,
            onConfirm,
            children,
        } = this.props
        const { actionButton, ...restclasses } = classes

        const confirm = () => {
            onConfirm(this.state.confirmationData)
            this.setState({ modelOpen: false })
        }
        const dismiss = () => this.setState({ modelOpen: false })

        const dialog = this.state.modelOpen && (
            <Dialog
                onClick={e => e.stopPropagation()}
                open={this.state.modelOpen}
                onClose={() => {
                    this.setState({ modelOpen: false })
                }}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {dialogActions ? (
                        dialogActions(dismiss, confirm)
                    ) : (
                        <React.Fragment>
                            <AppButton
                                className={actionButton}
                                onClick={confirm}
                            >
                                Yes
                            </AppButton>
                            <AppButton
                                className={actionButton}
                                onClick={dismiss}
                            >
                                No
                            </AppButton>
                        </React.Fragment>
                    )}
                </DialogActions>
            </Dialog>
        )

        return (
            <React.Fragment>
                {dialog}
                {children({
                    askConfirmation: (data: any) =>
                        this.setState({
                            modelOpen: true,
                            confirmationData: data,
                        }),
                })}
            </React.Fragment>
        )
    }
}

export const RenderWithConfirmation = decorator(Component)
export default RenderWithConfirmation
