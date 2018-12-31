import React from "react";
import { defaultTo } from 'lodash-es';
import {DialogActions, DialogContent, Dialog, Theme, WithStyles, FormGroup, Button, Grid, FormControlLabel, Input} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import FieldsState from "shared/FieldsState";
import TextFieldWithState from "components/presentational/TextFieldWithState";
import { NotificationTemplateCreateUpdateRequestParameters } from "backend-notificationtemplate-service";
import { NotificationTemplate, NotificationTemplateValue, EmailTemplate, SMSTemplate } from "models/NotificationTemplate";
import fileButton from "app-react/HOC/FileButton";
import AppDialogButton from "app-react/components/presentational/AppDialogButton";
import AppDialogHeader from "app-react/components/presentational/AppDialogHeader";
import AppSwitch from "app-react/components/presentational/AppSwitch";
import WithFieldState from "app-react/components/presentational/WithFieldState";
import { HTMLEditor } from "../HTMLEditor";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import "@webscopeio/react-textarea-autocomplete/style.css";

const styles = (theme:Theme) => createStyles({
    paper: {
        width: '70%',
        overflow: 'visible',
        maxWidth: 'inherit',
        borderRadius: '10px'
    },
    emailSubject: {
        marginBottom: theme.spacing.unit,
        width: '40%'
    },
    templateSwitchLabel: {
        marginBottom: theme.spacing.unit
    },
    marginTop: {
        marginTop: theme.spacing.unit
    },
    dialogActions: {
        padding: theme.spacing.unit,
        borderTop: `solid 1px ${theme.palette.grey["200"]}`
    },
});

const decorator = withStyles(styles);

interface NotificationTemplateDialogProps {
    notificationTemplate?:NotificationTemplate
    location_id:number
    open:boolean
    done:boolean
    fieldsState:FieldsState
    onClose:(notificationTemplate?:NotificationTemplateCreateUpdateRequestParameters)=>void
}

type StyledProps = NotificationTemplateDialogProps & WithStyles<typeof styles>;

interface State extends NotificationTemplateCreateUpdateRequestParameters {
    [index:string]:any
}

const UploadButton = fileButton(Button);

class NotificationTemplateDialog extends React.PureComponent<StyledProps, State> {
    constructor(props:StyledProps) {
        super(props);
        const {
            id = null,
            name = '',
            value = null, 
            location_id = props.location_id,
        } = this.props.notificationTemplate ? this.props.notificationTemplate : {};

        this.state = {
            id: id,
            name: defaultTo(name,''),
            value: defaultTo<NotificationTemplateValue>(value,{
                email: {
                    enabled: true,
                    body: '',
                    subject: ''
                },
                sms: {
                    body: '',
                    enabled: true
                }
            }),
            location_id: props.location_id,
        };
        
        this.createUpdate = this.createUpdate.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
    }

    protected isUpdate() {
        return this.props.notificationTemplate!==null;
    }

    protected createUpdate(event:React.MouseEvent<HTMLInputElement>) {
        const { onClose = ()=>{} } = this.props;
        onClose({
            location_id: this.state.location_id,
            id: this.isUpdate() ? this.props.notificationTemplate.id : undefined,
            name: this.state.name,
            value: this.state.value
        });
    }

    protected handleTextInputChange(event:React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            [event.currentTarget.name]: event.currentTarget.value
        });
    }

    render() {
        const {onClose = ()=>{}, fieldsState = new FieldsState(), notificationTemplate, classes, ...rest} = this.props;
        
        return (
            <Dialog open={rest.open} scroll={'body'} classes={{paper:classes.paper}}>
                <AppDialogHeader
                    onClose={onClose}
                    headerContent={
                        <React.Fragment>
                            <Grid container>
                                <Grid item container lg={3} md={4} xs={6}>
                                <TextFieldWithState 
                                    margin={'normal'} name={'name'} onChange={this.handleTextInputChange} label={'Notification Name'} 
                                    errorInfo={fieldsState.getError('name')} value={this.state.name} 
                                    required fullWidth={true} />
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    }
                />
                <DialogContent style={{overflow: 'visible'}}>
                    <div>
                        <FormGroup>
                            <EmailTemplateControl value={this.state.value.email} fieldState={this.props.fieldsState} onChange={(temp)=>{
                                this.setState({
                                    value: {
                                        ...this.state.value,
                                        email: temp
                                    }
                                })
                            }} />
                        </FormGroup>
                        <FormGroup>
                            <SMSTemplateControl value={this.state.value.sms} fieldState={this.props.fieldsState} onChange={(temp)=>{
                                this.setState({
                                    value: {
                                        ...this.state.value,
                                        sms: temp
                                    }
                                })
                            }} />
                        </FormGroup>
                    </div>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <AppDialogButton disabled={!this.props.done} onClick={this.createUpdate}>
                        Save Changes
                    </AppDialogButton>
                    <AppDialogButton onClick={() => onClose(null)} styleVariant={'dismiss'}>
                        Cancel
                    </AppDialogButton>
                </DialogActions>
            </Dialog>
        );
    }
}

interface EmailTemplateControlProps {
    onChange:(template:EmailTemplate)=>void
    value:EmailTemplate
    fieldState:FieldsState
}

type StyledEmailTemplateControlProps = EmailTemplateControlProps & WithStyles<typeof styles>

export const EmailTemplateControl = decorator(
    class extends React.PureComponent<StyledEmailTemplateControlProps, any> {
        render() {
            const {classes, fieldState, value} = this.props;
            
            return <React.Fragment>
                <FormControlLabel
                    className={classes.templateSwitchLabel}
                    control={
                        <AppSwitch
                            checked={value.enabled}
                            onChange={(e)=>{
                                this.props.onChange({
                                    ...value,
                                    enabled: e.target.checked
                                });
                            }}
                        />
                    }
                    label="Email"
                />
                <WithFieldState
                    showLabel={false}
                    errorInfo={fieldState.getError('email_subject')}
                    renderProps={()=>{
                        return <Input className={classes.emailSubject} placeholder={"Email Subject Line"} onChange={(e)=>{
                            this.props.onChange({
                                ...value,
                                subject: e.target.value
                            });
                        }} value={value.subject}  />
                    }}
                />
                <WithFieldState
                    showLabel={false}
                    errorInfo={fieldState.getError('email_body')}
                    renderProps={()=>{
                        return <HTMLEditor 
                                    onHtmlChange={(html)=>{
                                        this.props.onChange({
                                            ...value,
                                            body: html
                                        });
                                    }}
                                    html={this.props.value.body}
                                    mention={{
                                        separator: ' ',
                                        trigger: '%',
                                        suggestions: suggestions
                                    }}
                         />
                    }}
                />
            </React.Fragment>
        }
    }
);

const suggestions = [
    { text: 'visitor-name', value: 'visitor-name%', url: '%visitor-name%' },
    { text: 'kiosk', value: 'kiosk%', url: '%kiosk%' },
    { text: 'company', value: 'company%', url: '%company%' },
    { text: 'cellnum', value: 'cellnum%', url: '%cellnum%' },
];

interface SMSControlProps {
    onChange:(template:SMSTemplate)=>void
    value:SMSTemplate
    fieldState:FieldsState
}

type StyledSMSTemplateControlProps = SMSControlProps & WithStyles<typeof styles>

const Item = ({ entity: { url } }) => <div>{`${url}`}</div>;
const Loading = ({ data }) => <div>Loading</div>;

export const SMSTemplateControl = decorator(
    class extends React.PureComponent<StyledSMSTemplateControlProps, any> {
        render() {
            const {classes, fieldState, value} = this.props;
            
            return <React.Fragment>
                <FormControlLabel
                    className={classes.templateSwitchLabel}
                    control={
                        <AppSwitch
                            checked={value.enabled}
                            onChange={(e)=>{
                                this.props.onChange({
                                    ...value,
                                    enabled: e.target.checked
                                });
                            }}
                        />
                    }
                    label="SMS"
                />
                
                <WithFieldState
                    showLabel={false}
                    errorInfo={fieldState.getError('sms_body')}
                    renderProps={()=>{    
                        return <ReactTextareaAutocomplete
                            style={{
                                resize: 'vertical'
                            }}
                            loadingComponent={Loading}
                            rows={8}
                            value={value.body}
                            onChange={(e)=>{
                                this.props.onChange({
                                    ...value,
                                    body: e.target.value
                                })
                            }}
                            // style={{
                            //     fontSize: "18px",
                            //     lineHeight: "20px",
                            //     padding: 5
                            // }}
                            // containerStyle={{
                            //     marginTop: 20,
                            //     width: 400,
                            //     height: 100,
                            //     margin: "20px auto"
                            // }}
                            minChar={0}
                            trigger={{
                                "%": {
                                    dataProvider: token => {
                                        return suggestions.filter(s=>s.url.indexOf(token)>-1);
                                    },
                                    component: Item,
                                    output: (item, trigger) => item.url
                                }
                            }}
                        />
                    }}
                />
            </React.Fragment>
        }
    }
);

export default decorator(NotificationTemplateDialog);