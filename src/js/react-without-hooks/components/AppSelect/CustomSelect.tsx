import React from "react";
import { defaults } from 'lodash-es';
import { Theme, WithTheme, StandardProps } from "@material-ui/core";
import { withStyles, createStyles }from "@material-ui/styles";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";
import { FixedSizeListProps } from "react-window";
import { CustomSelectComponentSelectProps } from "./types";
import { Option, Control, MenuList, Menu, MultiValue, NoOptionsMessage, Placeholder, SingleValue, ValueContainer } from "./CustomComponents";
import { StyleClassKey } from "typehelper";
import { Props } from "react-select/src/Select";

const styles = (theme: Theme) => createStyles({
    root: {
        '&$fullWidth': {
            width: '100%'
        },
		backgroundColor: theme.palette.background.paper,
    },
    fullWidth: {
    },
    formControl: {
        height: 'auto',
        minHeight: '40px',
        borderRadius: '5px',
        '&:hover': {
            borderBottom: `1px solid ${theme.palette.primary.main}!important`,
        }
    },
    formControlInput: {
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    controlContainer: {
        display: 'flex',
        flexGrow: 1
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center'
    },
    noOptionsMessage: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
    singleValue: {
        fontSize: 16,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    placeholder: {
        position: 'absolute',
        left: 2,
		paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        fontSize: 16,
    },
    paper: {
        border: `1px solid ${theme.palette.grey.A100}`,
        background: theme.palette.background.paper,
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
    chip: {
        borderRadius: '0px',
        height: 'auto',
        padding: theme.spacing(1)/3,
        margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`,
    },
    chipLabel: {
        order: 1
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    deleteIconStyle: {
        // color: theme.custom.text.secondary,
        margin: '0px',
        order: 0,
        fontSize: theme.typography.pxToRem(12),
        marginLeft: '5px',
        marginRight: '-8px',
    },
    reloadIcon: {
        alignSelf: 'flex-start',
        padding: theme.spacing(1)/2
    }
});

export type CustomSelectClassKey = StyleClassKey<typeof styles>;

const ccomponents = {
    Control,
    MenuList,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
}

interface PrivateProps extends StandardProps<{}, CustomSelectClassKey> {
    showDropdownIndicator?:boolean
    fullWidth?:boolean
    fixedSizeListProps?:FixedSizeListProps
    allowReload?:boolean
    onReload?:()=>void
}

export type CustomSelectProps<TProps extends Props<OptionType>, OptionType> = PrivateProps & Partial<WithTheme> & TProps & {
    Component:React.ComponentType<TProps>
};

const decorator = withStyles(styles, {withTheme: true});

function Component<TProps extends CustomSelectProps<SProps, OptionType>, SProps extends Props<OptionType>, OptionType> (props: TProps) {
    let defaultedProps:typeof props = {...props as any};
    defaults(defaultedProps, {
        menuShouldBlockScroll: false,
        showDropdownIndicator: true,
        hideSelectedOptions: false,
        components: ccomponents,
        filterOption: undefined,
        isMulti: false,
        isSearchable: true,
        placeholder: '',
        isClearable: false,
        allowReload: false,
        onReload: ()=>{},
        value: null,
        fullWidth: false,
    } as TProps);

    defaults(defaultedProps.components,{
        Control: ccomponents.Control,
        MenuList: ccomponents.MenuList,
        Menu: ccomponents.Menu,
        MultiValue: ccomponents.MultiValue,
        NoOptionsMessage: ccomponents.NoOptionsMessage,
        Option: ccomponents.Option,
        Placeholder: ccomponents.Placeholder,
        SingleValue: ccomponents.SingleValue,
        ValueContainer: ccomponents.ValueContainer
    });


    const { styles, showDropdownIndicator, theme, classes, fullWidth, allowReload, onReload, fixedSizeListProps } = defaultedProps;

    const extraInjectedProps:CustomSelectComponentSelectProps = {
        classes,
        controlProps: {
            fullWidth: fullWidth,
            allowReload,
            onReload
        },
        fixedSizeListProps: fixedSizeListProps
    };
    
    const TComponent:React.ComponentType<SProps> = defaultedProps.Component;
    
    return (
        <TComponent
            {...defaultedProps}
            className={classNames(defaultedProps.className, classes.root,{
                [classes.fullWidth]: fullWidth
            })}
            {...extraInjectedProps}
            styles={{
                indicatorsContainer: (base)=>({
                    ...base
                }),
                input: (base)=>({
                    ...base,
                    paddingLeft: theme.spacing(1),
                    paddingRight: theme.spacing(1),
                }),
                indicatorSeparator: (base)=>({
                    ...base,
                    display: 'none'
                }),
                dropdownIndicator: (base)=>({
                    ...base,
                    display: !showDropdownIndicator ? 'none' : undefined
                }),
                ...styles
            }}
            />
    );
}

export const CustomSelect = decorator(Component);
export default CustomSelect;