import React from 'react';
import { Theme, createStyles, StandardProps, withStyles } from '@material-ui/core';
import { StyleClassKeys } from 'interfaces/Types';
import SimpleKeyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { toRGBAString } from 'shared/Color';
import { ThemeSettingIdentifier } from 'models/ThemeSetting';

const buttonSize = 90;
const buttonSpacing = 10;

const styles = (theme:Theme)=>{
    const buttonSetting = theme.custom.kiosk.setting[ThemeSettingIdentifier.setting_button];
    return createStyles({
        invisible: {
            visibility: 'hidden'
        },
        round: {
        },
        numberTheme: {
        },
        alphanumericTheme: {
        },
        clearButton: {
        },
        acceptButton: {
        },
        spaceButton: {
        },
        numberButton: {
        },
        theme: {
            padding: buttonSpacing,
            backgroundColor: 'transparent!important',
            '&$numberTheme': {
                width: `${((buttonSize+buttonSpacing)*3)-buttonSpacing}px`
            },
            '&$alphanumericTheme':{
                width: `${((buttonSize+buttonSpacing)*11)-buttonSpacing}px`,
                '& .hg-row':{
                    '&:first-child':{
                        justifyContent: 'center'
                    },
                    '&:not(:first-child)':{
                        justifyContent: 'flex-end'
                    },
                    '& $acceptButton':{
                        maxWidth: '150px',
                        borderRadius: '45px'
                    },
                    '& $spaceButton':{
                        maxWidth: '302px',
                        borderRadius: '45px',
                        color: toRGBAString(buttonSetting.secondary.color),
                        backgroundColor: toRGBAString(buttonSetting.secondary.background),
                        '& span': {
                            transform: 'scale(2,1)'
                        }
                    },
                    '& $numberButton':{
                        color: toRGBAString(buttonSetting.secondary.color),
                        backgroundColor: toRGBAString(buttonSetting.secondary.background),
                    }
                },
            },
            '& .hg-row .hg-button': {
                '&:not(:last-child)':{
                    marginRight: buttonSpacing,
                },
                ...theme.custom.kiosk.font,
                height: `${buttonSize}px`,
                fontSize: '30px',
                color: toRGBAString(buttonSetting.primary.color),
                backgroundColor: toRGBAString(buttonSetting.primary.background),
                maxWidth: `${buttonSize}px`,
                '&$round':{
                    borderRadius: '50%',
                },
                '&$clearButton':{
                    color: toRGBAString(buttonSetting.cancel.color),
                    backgroundColor: toRGBAString(buttonSetting.cancel.background),
                },
                '&$acceptButton':{
                    color: toRGBAString(buttonSetting.accept.color),
                    backgroundColor: toRGBAString(buttonSetting.accept.background),
                }
            }
        }
    })
};

type KeyboardClassKeys = StyleClassKeys<typeof styles>

interface KeyboardProps extends StandardProps<{},KeyboardClassKeys> {
    input?:string
    inputName?:string
    onChange?:(input:string)=>void
    onEnter?:()=>void
    variant?:'number'|'alphanumeric'
}

const decorator = withStyles(styles);

interface State {
    input:string
}

export const Keyboard = decorator(
    class extends React.PureComponent<KeyboardProps,State> {
        protected keyboard:any;
        constructor(props:KeyboardProps) {
            super(props);
            this.onKeyPress = this.onKeyPress.bind(this);
            this.onChange = this.onChange.bind(this);
        }
        protected onChange(input:string) {
            const { onChange = ()=>{} } = this.props;
            onChange(input);
        }
        protected onKeyPress(button:string) {
            if(button==='{empty}') {
                this.onChange('');
            } else if(button==='{enter}') {
                if(this.props.onEnter) {
                    this.props.onEnter();
                }
            }
            return false;
        }
        protected updateInput() {
            const props = this.props;
            const input = this.keyboard.getInput(this.getInputName());
            if(input!==props.input) {
                this.keyboard.setInput(props.input, this.getInputName());
            }
        }
        componentDidMount() {
            this.updateInput();
        }
        componentDidUpdate(prevProps:KeyboardProps) {
            this.updateInput()
        }
        protected getInputName() {
            const {inputName = 'default'} = this.props;
            return inputName;
        }
        render() {
            const { inputName = 'default', classes, variant='number' } = this.props;
            const layoutName = variant;
            const layoutTheme = variant === 'number' ? classes.numberTheme : classes.alphanumericTheme;
            return (
                <SimpleKeyboard
                    preventMouseDownDefault
                    inputName={inputName}
                    ref={r => (this.keyboard = r)}
                    layoutName={layoutName}
                    theme={`${classes.theme} ${layoutTheme} react-simple-keyboard simple-keyboard hg-theme-default hg-layout-number`}
                    layout={{
                        'alphanumeric': [
                            '1 2 3 4 5 6 7 8 9 0',
                            'Q W E R T Y U I O P {empty}',
                            'A S D F G H J K L {enter}',
                            'Z X C V B N M {space}',
                        ],
                        'number': [
                            '1 2 3',
                            '4 5 6',
                            '7 8 9',
                            '{none} 0 {empty}'
                        ]
                    }}
                    display={{
                        '{empty}': 'X',
                        '{enter}': 'ENTER',
                        '{space}': '&UnderBracket;'
                    }}
                    buttonTheme={[
                        {
                            'class': classes.invisible,
                            buttons: '{none}'
                        },
                        {
                            'class': classes.round,
                            buttons: '1 2 3 4 5 6 7 8 9 0 {empty} Q W E R T Y U I O P A S D F G H J K L Z X C V B N M'
                        },
                        {
                            'class': classes.numberButton,
                            buttons: '1 2 3 4 5 6 7 8 9 0'
                        },
                        {
                            'class': classes.spaceButton,
                            buttons: '{space}'
                        },
                        {
                            'class': classes.clearButton,
                            buttons: '{empty}'
                        },
                        {
                            'class': classes.acceptButton,
                            buttons: '{enter}'
                        }
                    ]}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                />
            );
        }
    }
);