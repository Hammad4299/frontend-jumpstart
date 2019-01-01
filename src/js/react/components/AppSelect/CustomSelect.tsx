import React from "react";
import { defaults, defaultsDeep } from 'lodash-es';
import { Theme, WithTheme, StandardProps } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";
import { Props } from "react-select/lib/Select";
import { FixedSizeListProps } from "react-window";
import { StyleClassKey } from 'typehelper';
import { CustomSelectComponentSelectProps } from "./types";
import { Option, Control, MenuList, Menu, MultiValue, NoOptionsMessage, Placeholder, SingleValue, ValueContainer } from "./CustomComponents";

const styles = (theme: Theme) => createStyles({
    root: {
        '&$noFullWidth': {
            display: 'inline'
        }
    },
    noFullWidth: {
    },
    controlRoot: {
        height: 'auto',
        minHeight: '40px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '5px',
        '&$primaryBorder': {
            border: `1px solid ${theme.palette.primary.main}`
        },
        '&:hover': {
            borderBottom: `1px solid ${theme.palette.primary.main}!important`,
        }
    },
    primaryBorder: {

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
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        border: `1px solid ${theme.palette.grey.A100}`,
        background: theme.palette.background.paper,
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        borderRadius: '0px',
        height: 'auto',
        padding: theme.spacing.unit/3,
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
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
        margin: '0px',
        order: 0,
        fontSize: theme.typography.pxToRem(12),
        marginLeft: '5px',
        marginRight: '-8px',
    },
    reloadIcon: {
        alignSelf: 'flex-start',
        padding: theme.spacing.unit/2
    }
});

export type CustomSelectClassKey = StyleClassKey<typeof styles>;


const ccomponents:Props['components']= {
    Control,
    MenuList,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

interface PrivateProps<TProps extends Props<OptionType>, OptionType> extends StandardProps<{}, CustomSelectClassKey> {
    showDropdownIndicator?:boolean
    fullWidth?:boolean
    fixedSizeListProps?:FixedSizeListProps
    allowReload?:boolean
    onReload?:()=>void
    Component:React.ComponentType<TProps>
}

export type CustomSelectProps<TProps extends Props<OptionType>, OptionType> = PrivateProps<TProps,OptionType> & Partial<WithTheme> & TProps;
const decorator = withStyles(styles, {withTheme: true});

function Component<TProps extends Props<OptionType>, OptionType>(props: CustomSelectProps<TProps, OptionType>) {
    let defaultedProps:typeof props = {...props as any};
    defaults(defaultedProps, {
        menuShouldBlockScroll: false,
        showDropdownIndicator: true,
        hideSelectedOptions: false,
        components: ccomponents,
        filterOption: undefined,
        isMulti: false,
        onBlur: ()=>{},
        isSearchable: true,
        placeholder: '',
        isClearable: false,
        allowReload: false,
        onReload: ()=>{},
        value: null,
        fullWidth: false,
    });

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

    const { showDropdownIndicator, theme, classes, fullWidth, allowReload, onReload, fixedSizeListProps } = defaultedProps;

    const extraInjectedProps:CustomSelectComponentSelectProps = {
        classes,
        controlProps: {
            fullWidth: fullWidth,
            allowReload,
            onReload
        },
        fixedSizeListProps: fixedSizeListProps
    };
    
    let TComponent:React.ComponentType<Props<OptionType>> = Component;  //bypassing typscript
    return (
        <TComponent
            {...defaultedProps}
            className={classNames(classes.root,{
                [classes.noFullWidth]: !fullWidth
            })}
            {...extraInjectedProps}
            styles={{
                indicatorsContainer: (base)=>({
                    ...base,
                    backgroundColor: theme.palette.background.paper
                }),
                input: (base)=>({
                    ...base,
                    paddingLeft: theme.spacing.unit,
                    paddingRight: theme.spacing.unit,
                }),
                indicatorSeparator: (base)=>({
                    ...base,
                    display: 'none'
                }),
                dropdownIndicator: (base)=>({
                    ...base,
                    display: !showDropdownIndicator ? 'none' : undefined
                }),
            }}
            />
    );
}

export const CustomSelect = decorator(Component);
export default CustomSelect;