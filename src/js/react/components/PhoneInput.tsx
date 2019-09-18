import { StyleClassKey } from "../typescript";
import React from "react";
import "react-phone-number-input/style.css";
import { default as ReactPhoneInput } from "react-phone-number-input/core";
import {
    Theme,
    Typography,
    Paper,
    Input,
    StandardProps
} from "@material-ui/core";
import { withStyles, createStyles } from "@material-ui/styles";
import { AppSelect, SimpleOption } from "./";
import InternationalIcon from "react-phone-number-input/international-icon";
import {
    parseIncompletePhoneNumber,
    formatIncompletePhoneNumber
} from "libphonenumber-js/custom";
/* eslint-disable */
const labels = require("react-phone-number-input/locale/default.json")
const metadata = require("libphonenumber-js/metadata.min.json")
/* eslint-enable */

const styles = (theme: Theme) => createStyles({});

export type PhoneInputClassKey = StyleClassKey<typeof styles>;

export interface PhoneInputProps extends StandardProps<{}, PhoneInputClassKey> {
    value: string;
    onChange: (value: string) => void;
}

const decorator = withStyles(styles);

class CountrySelect extends React.Component<any, any> {
    render() {
        const props = this.props;
        const selected = props.options.filter(opt => opt.value === props.value);
        return (
            <AppSelect
                options={props.options}
                styles={{
                    container: () => ({
                        alignSelf: "stretch",
                        borderRight: "1px solid #ccc"
                    }),
                    dropdownIndicator: () => ({
                        alignSelf: "center"
                    })
                }}
                components={{
                    Control: props => {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    height: "100%",
                                    padding: "7px"
                                }}
                                ref={props.innerRef}
                                {...props.innerProps}
                            >
                                {props.children}
                            </div>
                        );
                    },
                    Menu: props => {
                        return (
                            <Paper
                                elevation={0}
                                square
                                style={{
                                    width: "300px",
                                    zIndex: 1,
                                    position: "absolute"
                                }}
                                {...props.innerProps}
                            >
                                {props.children}
                            </Paper>
                        );
                    },
                    SingleValue: props => {
                        const { icon: Icon, value } = props.data;
                        return <Icon value={value} />;
                    }
                }}
                onChange={(opt: SimpleOption) => props.onChange(opt.value)}
                formatOptionLabel={({ icon: Icon, label, ...rest }) => {
                    return (
                        <React.Fragment>
                            <Icon value={rest.value} />
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Typography>{label}</Typography>
                        </React.Fragment>
                    );
                }}
                value={selected}
            />
        );
    }
}

class CustomInput extends React.Component<any, any> {
    protected input: any;
    constructor(props: any) {
        super(props);
        this.state = {
            value: this.props.value
        };
        this.storeInput = this.storeInput.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChange(event) {
        const { onChange } = this.props;
        const { value } = this.state;

        let newValue = parseIncompletePhoneNumber(event.target.value);

        // By default, if a value is something like `"(123)"`
        // then Backspace would only erase the rightmost brace
        // becoming something like `"(123"`
        // which would give the same `"123"` value
        // which would then be formatted back to `"(123)"`
        // and so a user wouldn't be able to erase the phone number.
        // Working around this issue with this simple hack.
        if (newValue === value) {
            if (this.format(newValue).startsWith(event.target.value)) {
                // Trim the last digit (or plus sign).
                newValue = newValue.slice(0, -1);
            }
        }

        // Prevents React from resetting the `<input/>` caret position.
        // https://github.com/reactjs/react-redux/issues/525#issuecomment-254852039
        // https://github.com/facebook/react/issues/955
        this.setState({ value: newValue }, () => onChange(newValue));
    }

    format(value) {
        const { country, metadata } = this.props;
        return formatIncompletePhoneNumber(value, country, metadata);
    }

    onBlur(event) {
        const { onBlur } = this.props;
        const { value } = this.state;

        if (onBlur) {
            // `event` is React's `SyntheticEvent`.
            // Its `.value` is read-only therefore cloning it.
            const _event = {
                ...event,
                target: {
                    ...event.target,
                    value
                }
            };

            // Workaround for `redux-form` event detection.
            // https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
            _event.stopPropagation = event.stopPropagation;
            _event.preventDefault = event.preventDefault;

            return onBlur(_event);
        }
    }

    focus() {
        this.input.focus();
    }

    storeInput(ref) {
        this.input = ref;
    }

    render() {
        const { country, onFocus, onChange, metadata, ...rest } = this.props;
        const { value } = this.state;
        return (
            <Input
                type="tel"
                style={{
                    border: "none"
                }}
                autoComplete="tel"
                {...rest}
                ref={this.storeInput}
                value={this.format(value)}
                disableUnderline
                onChange={this.onChange}
                onFocus={onFocus}
                onBlur={this.onBlur}
            />
        );
    }
}

function Component(props: PhoneInputProps) {
    const { classes, ...rest } = props;

    return (
        <ReactPhoneInput
            {...rest}
            labels={labels}
            style={{
                border: "1px solid #ccc"
            }}
            internationalIcon={InternationalIcon}
            metadata={metadata}
            countrySelectComponent={CountrySelect}
            inputComponent={CustomInput}
        />
    );
}

Component.displayName = "PhoneInput";

export const PhoneInput = decorator(Component);
export default PhoneInput;
