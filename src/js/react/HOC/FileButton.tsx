import React from "react";
import { uniqueId } from 'lodash-es';
import Input, { InputProps } from "@material-ui/core/Input";
import { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import { Button } from "@material-ui/core";

export function fileButton<T extends ButtonBaseProps>(Component:React.ComponentType<T>) {
    interface Props {
        onFilesChange?:(files:FileList)=>void,
        inputProps?:InputProps
    }
    interface State {
        id:string
    }
    type FileButtonProps = Props & T;

    return class extends React.PureComponent<FileButtonProps,State> {
        constructor(props:FileButtonProps) {
            super(props);
            this.fileChanged = this.fileChanged.bind(this);
            this.state = {
                id: uniqueId('file_inp_hoc')
            };
        }
    
        protected fileChanged(event:React.ChangeEvent<HTMLInputElement>) {
            const files = event.currentTarget.files;
            const {onFilesChange = ()=>{}} = this.props as Props;
            onFilesChange(files);
        }
    
        render(){
            const { onFilesChange = ()=>{}, inputProps, ...tmp} = this.props as Props;
            const rest:T = tmp as any;
            const id = this.state.id;
    
            return (
                <React.Fragment>
                    <Input {...inputProps} onChange={this.fileChanged} style={{display: 'none'}} type={'file'} id={id} />
                    <Component {...{htmlFor:id}} component={'label'} {...rest} />
                </React.Fragment>
            )
        }
    }
}