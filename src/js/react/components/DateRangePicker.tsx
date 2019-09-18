import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
    Theme,
    Popper,
    Fade,
    Paper,
    Button,
    Icon,
    ClickAwayListener,
    Typography,
    StandardProps
} from "@material-ui/core";
import { withStyles, createStyles } from "@material-ui/styles";
import { DateRangePicker as DateRangepicker } from "react-date-range";
import moment from "moment";
import { DateRange as CalendarIcon } from "@material-ui/icons";
import { StyleClassKey } from "typehelper";
import { AppButton } from "components";

const styles = (theme: Theme) =>
    createStyles({
        icon: {
            marginRight: theme.spacing(1)
        },
        bottomContainer: {
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end",
            borderTop: `solid 1px ${theme.palette.grey[200]}`,
            padding: theme.spacing(1)
        },
        datePreview: {
            margin: theme.spacing(1) / 2
        },
        actionButton: {
            padding: `${theme.spacing(1) / 2}px ${theme.spacing(1)}px`,
            minHeight: "initial",
            margin: theme.spacing(1) / 2
        }
    });

export type DateRangePickerClassKey = StyleClassKey<typeof styles>;

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

interface State {
    open: boolean;
    internalRange: DateRange;
}

export interface DateRangePickerProps
    extends StandardProps<{}, DateRangePickerClassKey> {
    range: DateRange;
    onChange?: (range: DateRange) => void;
    onApply?: (range: DateRange) => void;
}

const decorator = withStyles(styles);

class Component extends React.PureComponent<DateRangePickerProps, State> {
    protected ref: React.RefObject<any>;
    protected anchorEl: any;
    constructor(props: DateRangePickerProps) {
        super(props);
        this.state = {
            open: false,
            internalRange: this.props.range
        };
        this.ref = React.createRef();
        this.onChange = this.onChange.bind(this);
        this.onApply = this.onApply.bind(this);
    }

    componentDidUpdate(prevProp: DateRangePickerProps) {
        if (this.props.range !== prevProp.range) {
            this.setState({
                internalRange: this.props.range
            });
        }
    }

    protected onApply(a: any) {
        const { onApply = () => {} } = this.props;
        this.setState({
            open: false
        });
        onApply(this.state.internalRange);
    }

    protected onChange(a: any) {
        const { onChange = () => {} } = this.props;
        this.setState({
            internalRange: {
                endDate: a.selection.endDate,
                startDate: a.selection.startDate
            }
        });
        onChange({
            endDate: a.selection.endDate,
            startDate: a.selection.startDate
        });
    }

    protected rangeToString(range: DateRange) {
        return `${moment(range.startDate).format("MMMM DD, YYYY")} - ${moment(
            range.endDate
        ).format("MMMM DD, YYYY")}`;
    }

    render() {
        const { classes, range, ...rest } = this.props;
        const anchorEl = this.anchorEl;
        return (
            <ClickAwayListener
                onClickAway={() => this.setState({ open: false })}
            >
                <div>
                    <Button
                        ref={node => (this.anchorEl = node)}
                        variant={"outlined"}
                        onClick={e =>
                            this.setState({
                                open: true
                            })
                        }
                    >
                        <Icon className={classes.icon}>
                            <CalendarIcon />
                        </Icon>
                        {this.rangeToString(range)}
                    </Button>
                    <Popper
                        placement="bottom-end"
                        style={{ zIndex: 1 }}
                        disablePortal
                        open={this.state.open}
                        anchorEl={anchorEl}
                        transition
                    >
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <Paper elevation={2}>
                                    <div>
                                        <DateRangepicker
                                            months={2}
                                            direction={"horizontal"}
                                            ranges={[
                                                {
                                                    ...this.state.internalRange,
                                                    key: "selection"
                                                }
                                            ]}
                                            onChange={this.onChange}
                                        />
                                        <div
                                            className={classes.bottomContainer}
                                        >
                                            <Typography
                                                className={classes.datePreview}
                                            >
                                                {this.rangeToString(
                                                    this.state.internalRange
                                                )}
                                            </Typography>
                                            <AppButton
                                                onClick={() =>
                                                    this.setState({
                                                        open: false
                                                    })
                                                }
                                                className={classes.actionButton}
                                            >
                                                Cancel
                                            </AppButton>
                                            <AppButton
                                                onClick={this.onApply}
                                                className={classes.actionButton}
                                            >
                                                Apply
                                            </AppButton>
                                        </div>
                                    </div>
                                </Paper>
                            </Fade>
                        )}
                    </Popper>
                </div>
            </ClickAwayListener>
        );
    }
}

export const DateRangePicker = decorator(Component);
export default DateRangePicker;
