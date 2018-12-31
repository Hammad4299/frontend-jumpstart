import React from 'react';
import { withStyles, WithStyles, Theme, createStyles } from '@material-ui/core';
import { Editor, EditorProps } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const styles = (theme:Theme)=>createStyles({
    editor: {
        border: `${theme.palette.grey["200"]} 1px solid`,
        height: '200px'
    }
})

interface State {
    editorState:EditorState
}

export interface Props extends EditorProps {
    html?:string
    onHtmlChange?:(html:string)=>void
}

type StyledProps<T> = T & WithStyles<typeof styles>

const decorator = withStyles(styles);

class Component extends React.PureComponent<StyledProps<Props>, State> {
    constructor(props:StyledProps<Props>) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        }
        
        if(this.props.html) {
            const contentBlock = htmlToDraft(this.props.html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState
                };
            }
        }
        
        
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
    }

    protected onEditorStateChange(state:EditorState) {
        this.setState({
            editorState: state
        });

        const {onHtmlChange} = this.props;
        if(onHtmlChange) {
            onHtmlChange(draftToHtml(convertToRaw(state.getCurrentContent())))
        }
    }

    render() {
        const {classes, ...rest} = this.props;
        
        return (
            <Editor 
                editorState={this.state.editorState}
                editorClassName={classes.editor}
                onEditorStateChange={this.onEditorStateChange}
                {...rest}
                />
        );
    }
}

export const HTMLEditor = decorator(Component);