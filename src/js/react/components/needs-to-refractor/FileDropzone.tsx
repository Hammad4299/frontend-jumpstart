import React from 'react';
import { createStyles, Theme, withStyles, WithStyles, Typography, Button, Icon } from "@material-ui/core";
import Dropzone from 'react-dropzone';
import { DropzoneProps } from 'react-dropzone';
import { CloudUpload as UploadIcon } from '@material-ui/icons'
import { lighten } from '@material-ui/core/styles/colorManipulator';


const styles = (theme:Theme) => createStyles({
    dropzone: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        '&$activeClass': {
            backgroundColor: theme.palette.grey[200],
        }
    },
    dropzoneContentWrapper: {
        flexWrap: 'wrap',
        justifyContent: 'center',
        display: 'flex'
    },
    activeClass: {
        
    },
    icon: {
        marginBottom: theme.spacing(2),
        color: theme.palette.grey[400],
        fontSize: theme.typography.h6.fontSize
    },
    message: {
    },
    uploadButton: {
    },
    fullWidth: {
        width: '100%'
    },
    root: {
        border: `4px ${theme.palette.grey[400]} dashed`
    }
});

interface Props extends DropzoneProps {
    uploadIcon?:React.ReactNode
    msg?:React.ReactNode
    buttonText?:React.ReactNode
    showButton?:boolean
}

interface State {
}

const decorator = withStyles(styles);

type StyledProps = WithStyles<typeof styles> & Props;

class FileDropzone extends React.PureComponent<StyledProps, State> {
    constructor(props:StyledProps) {
        super(props);
        this.state = {};
    }
    render() {
        const { 
            uploadIcon = <UploadIcon />,
            showButton = true, 
            buttonText = "Browse Files",
            classes,
            msg = (
                <div className={classes.fullWidth}>
                    <Typography variant={'h5'} align={'center'} className={classes.fullWidth}>Drag & Drop files here</Typography>
                    <br />
                    <div className={classes.fullWidth} style={{textAlign: 'center'}}>or</div>
                    <br />
                </div>
            ), ...rest} = this.props;
        return (
            <div className={classes.root}>
                <Dropzone activeClassName={classes.activeClass} className={classes.dropzone} {...rest}>
                    <div className={classes.dropzoneContentWrapper}>
                        <div>
                            <Icon className={classes.icon}>
                                {uploadIcon}
                            </Icon>
                        </div>
                        {msg}
                        {showButton && (
                            <Button variant={'contained'} color={'primary'}>{buttonText}</Button>
                        )}
                    </div>
                </Dropzone>
            </div>
        )
    }
}

export default decorator(FileDropzone);