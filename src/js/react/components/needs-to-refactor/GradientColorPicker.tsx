import React from "react"
import Grapick from "grapick"
import { defaults, defaultsDeep } from "lodash-es"
import {
    Theme,
    createStyles,
    withStyles,
    WithStyles,
    ClickAwayListener,
} from "@material-ui/core"
import CombinationInput, { CombinationInputValue } from "./CombinationInput"
import {
    GradientType,
    GradientColor,
    GradientStop,
    UnitValue,
    RadialGradientPosition,
    RadialGradientShape,
    RadialGradientSize,
    RadialGradientSizeType,
    isEllipseSize,
    LinearGradientParams,
    RadialGradientParam,
    EllipseSize,
    CircleSize,
} from "models/Gradient"
import AppSelect, { OptionType } from "./AppSelect"
import { toRGBAString, parseRGBAString } from "shared/Color"
import { toNumber } from "shared/utility"
import { SolidColorPicker } from "./SolidColorPicker"

const styles = (theme: Theme) =>
    createStyles({
        root: {
            position: "relative",
        },
        colorPicker: {
            position: "absolute",
            top: "38px",
            zIndex: 1,
        },
        controlsSection: {
            marginBottom: theme.spacing(1.5),
            display: "flex",
            flexWrap: "wrap",
        },
        colorStopPicker: {
            marginBottom: theme.spacing(1.5),
        },
        margin: {
            marginRight: theme.spacing(1),
        },
    })

interface Props {
    color?: GradientColor
    onChange?: (color: GradientColor) => void
}

interface State {
    handlerToPickColor: any
    forceRerender: any
}

interface GradientTypePickerProps {
    value: GradientType
    className?: string
    onChange: (type: GradientType) => void
}

export function GradientTypePicker({
    value,
    onChange = () => {},
    ...rest
}: GradientTypePickerProps) {
    const types: OptionType[] = [
        {
            label: "linear",
            value: "linear",
        },
        {
            label: "radial",
            value: "radial",
        },
    ]

    return (
        <AppSelect
            options={types}
            isSearchable={false}
            value={{
                value: value,
                label: value,
            }}
            onChange={(e: OptionType) => onChange(e.value)}
            {...rest}
        />
    )
}

interface RadialShapePickerProps {
    value: RadialGradientShape
    className?: string
    onChange: (type: RadialGradientShape) => void
}

export function RadialShapePicker({
    value = RadialGradientShape.auto,
    onChange = () => {},
    ...rest
}: RadialShapePickerProps) {
    const types: OptionType[] = [
        {
            label: "auto",
            value: "auto",
        },
        {
            label: "circle",
            value: "circle",
        },
        {
            label: "ellipse",
            value: "ellipse",
        },
    ]

    return (
        <AppSelect
            options={types}
            isSearchable={false}
            value={{
                value: value,
                label: value,
            }}
            onChange={(e: OptionType) => onChange(e.value)}
            {...rest}
        />
    )
}

interface AngleSelectorProps {
    value: UnitValue<"deg">
    className?: string
    onChange: (angle: UnitValue<"deg">) => void
}

function AngleSelector(props: AngleSelectorProps) {
    const {
        value = {
            unit: "deg",
            value: 0,
        },
        onChange = () => {},
    } = props
    return (
        <CombinationInput
            classes={{
                root: props.className,
            }}
            dropdownProps={{
                isSearchable: false,
                menuIsOpen: false,
                showDropdownIndicator: false,
            }}
            value={{
                inputValue: value.value,
                selection: {
                    label: "deg",
                    value: "deg",
                },
            }}
            inputProps={{
                placeholder: "Direction",
                style: {
                    width: "75px",
                },
            }}
            options={[
                {
                    label: "deg",
                    value: "deg",
                },
            ]}
            onChange={(val: CombinationInputValue<OptionType>) =>
                onChange({
                    value: val.inputValue,
                    unit: val.selection.value,
                })
            }
        />
    )
}

interface RadialPositionProps {
    value: RadialGradientPosition
    className?: string
    onChange: (angle: RadialGradientPosition) => void
}

function RadialPositionInput(props: RadialPositionProps) {
    const units = [
        {
            label: "%",
            value: "%",
        },
        {
            label: "px",
            value: "px",
        },
    ]
    const {
        value = {
            first: {
                value: 50,
                unit: "%" as "%",
            },
            second: {
                value: 50,
                unit: "%" as "%",
            },
        },
        onChange = () => {},
    } = props

    const inp = (pName: string) => (
        <CombinationInput
            classes={{
                root: props.className,
            }}
            dropdownProps={{
                isSearchable: false,
            }}
            value={{
                inputValue: value[pName].value,
                selection: units.find(u => u.value === value[pName].unit),
            }}
            inputProps={{
                placeholder: "Position",
                style: {
                    width: "75px",
                },
            }}
            options={units}
            onChange={(val: CombinationInputValue<OptionType>) =>
                onChange({
                    ...value,
                    [pName]: {
                        unit: val.selection.value,
                        value: val.inputValue,
                    },
                })
            }
        />
    )

    return (
        <React.Fragment>
            {inp("first")}
            {inp("second")}
        </React.Fragment>
    )
}

interface RadialSizeProps {
    value: RadialGradientSize
    shape: RadialGradientShape
    className?: string
    onChange: (angle: RadialGradientSize) => void
}

function RadialSizeInput(props: RadialSizeProps) {
    const fixedUnits = Object.keys(RadialGradientSizeType).map(
        key => RadialGradientSizeType[key]
    )
    const mapToOption = (arr: string[]) =>
        arr.map(item => ({
            label: item,
            value: item,
        }))
    const radiusUnits = mapToOption(["px", ...fixedUnits])
    const lengthUnits = mapToOption(["px", "%"])

    const {
        value = {
            radius: {
                value: "",
                unit: RadialGradientSizeType.farthestSide,
            },
            length: {
                value: "",
                unit: "px" as "px",
            } as any,
        },
        onChange = () => {},
    } = props
    const radiusInputDisabled = fixedUnits.includes(value.radius.unit)
    if (radiusInputDisabled) {
        value.radius.value = ""
    }

    return (
        <React.Fragment>
            <CombinationInput
                classes={{
                    root: props.className,
                }}
                dropdownProps={{
                    isSearchable: false,
                }}
                value={{
                    inputValue: value.radius.value,
                    selection: radiusUnits.find(
                        u => u.value === value.radius.unit
                    ),
                }}
                inputProps={{
                    placeholder: "Radius",
                    disabled: radiusInputDisabled,
                    style: {
                        width: "75px",
                    },
                }}
                options={radiusUnits}
                onChange={(val: CombinationInputValue<OptionType>) =>
                    onChange({
                        ...value,
                        radius: {
                            unit: val.selection.value,
                            value: val.inputValue,
                        },
                    })
                }
            />
            {props.shape === RadialGradientShape.ellipse &&
                isEllipseSize(value) && (
                    <CombinationInput
                        classes={{
                            root: props.className,
                        }}
                        dropdownProps={{
                            isSearchable: false,
                        }}
                        value={{
                            inputValue: value.length.value,
                            selection: lengthUnits.find(
                                u => u.value === value.length.unit
                            ),
                        }}
                        inputProps={{
                            placeholder: "Length",
                            style: {
                                width: "75px",
                            },
                        }}
                        options={lengthUnits}
                        onChange={(val: CombinationInputValue<OptionType>) =>
                            onChange({
                                ...value,
                                length: {
                                    unit: val.selection.value,
                                    value: val.inputValue,
                                },
                            })
                        }
                    />
                )}
        </React.Fragment>
    )
}

type StyledProps = Props & WithStyles<typeof styles>
const decorator = withStyles(styles)

class Picker extends React.PureComponent<StyledProps, State> {
    protected pickerElementRef: React.RefObject<HTMLDivElement>
    protected grapick: any
    constructor(props: StyledProps) {
        super(props)
        this.state = {
            forceRerender: null,
            handlerToPickColor: null,
        }

        this.radialShapedChanged = this.radialShapedChanged.bind(this)
        this.grapick = null
        this.pickerElementRef = React.createRef()
        this.gradientTypeChanged = this.gradientTypeChanged.bind(this)
    }

    protected angleChanged(angle: number | string) {
        const { onChange = () => {} } = this.props
        const c = this.getColor()
        onChange({
            ...c,
            param: {
                angle: {
                    unit: "deg",
                    value: toNumber(angle),
                },
            } as any,
        })
    }

    protected radialPositionChanged(position: RadialGradientPosition) {
        const { onChange = () => {} } = this.props
        const c = this.getColor()
        onChange({
            ...c,
            param: {
                ...c.param,
                position: position,
            },
        })
    }

    protected radialShapedChanged(value: RadialGradientShape) {
        const { onChange = () => {} } = this.props
        const c = this.getColor()
        onChange({
            ...c,
            param: {
                ...c.param,
                shape: value,
            },
        })
    }

    protected valueChanged() {
        const { onChange = () => {} } = this.props
        const a = this.getColor()
        a.colorStops = this.grapick.getHandlers().map(
            (handler: any): GradientStop => {
                return {
                    position: {
                        unit: "%",
                        value: handler.getPosition(),
                    },
                    color: parseRGBAString(handler.getColor()),
                }
            }
        )
        onChange(a)
    }

    protected getColor() {
        let color = this.props.color
        if (!color) {
            color = {} as any
        }
        defaults(color, {
            colorStops: [],
            param: {},
            type: GradientType.linear,
        } as GradientColor)
        if (color.type === GradientType.linear) {
            defaultsDeep(color.param, {
                angle: {
                    unit: "deg",
                    value: 90,
                },
            } as LinearGradientParams)

            color.param = {
                angle: {
                    ...color.param.angle,
                },
            }
        } else {
            defaultsDeep(color.param, {
                position: {
                    first: {
                        unit: "%",
                        value: 50,
                    },
                    second: {
                        unit: "%",
                        value: 50,
                    },
                },
                size: {},
                shape: RadialGradientShape.ellipse,
            } as RadialGradientParam)
            if (color.param.shape === RadialGradientShape.ellipse) {
                defaultsDeep(color.param.size, {
                    radius: {
                        unit: RadialGradientSizeType.farthestSide,
                        value: "",
                    },
                    length: {
                        unit: "%",
                        value: 50,
                    },
                } as EllipseSize)
                color.param.size = {
                    radius: { ...color.param.size.radius },
                    length: { ...color.param.size.length },
                } //remove any extra props not valid for current selection
            } else {
                defaultsDeep(color.param.size, {
                    radius: {
                        unit: RadialGradientSizeType.farthestSide,
                        value: "",
                    },
                } as CircleSize)
                color.param.size = {
                    radius: { ...color.param.size.radius },
                }
            }
            color.param = {
                position: {
                    ...color.param.position,
                },
                shape: color.param.shape as any,
                size: {
                    ...color.param.size,
                },
            }
        }
        return color
    }

    componentWillUnmount() {
        this.grapick.off("change")
        this.grapick.off("handler:select")
        this.grapick.off("handler:deselect")
        this.grapick.off("handler:position:change")
    }

    componentDidMount() {
        this.grapick = new Grapick({
            el: this.pickerElementRef.current,
            colorEl: '<span style="display:none"></span>',
        })

        this.initColorStops(this.getColor().colorStops)
        this.grapick.on("change", (complete: any) => {
            this.valueChanged()
        })

        this.grapick.on("handler:select", (complete: any) => {
            this.setState({
                handlerToPickColor: this.grapick.getSelected(),
            })
        })
        this.grapick.on("handler:deselect", (complete: any) => {
            this.setState({
                handlerToPickColor: null,
            })
        })
        this.grapick.on("handler:position:change", () => {
            this.setState({
                forceRerender: {},
            })
        })
    }

    protected radialSizeChanged(size: RadialGradientSize) {
        const { onChange = () => {} } = this.props
        const c = this.getColor()
        onChange({
            ...c,
            param: {
                ...c.param,
                size: size,
            },
        })
    }

    protected initColorStops(stops: GradientStop[]) {
        if (this.grapick) {
            this.grapick.clear()
            stops.forEach(stop => {
                this.grapick.addHandler(
                    stop.position.value,
                    toRGBAString(stop.color)
                )
            })
        }
    }

    protected gradientTypeChanged(type: GradientType) {
        const { onChange = () => {} } = this.props
        const c = this.getColor()
        onChange({
            ...c,
            type: type as any,
        })
    }

    render() {
        const { classes, ...rest } = this.props
        const color = this.getColor()
        const options = [
            { label: "%", value: "%" },
            { label: "px", value: "px" },
        ]

        return (
            <div className={classes.root}>
                <ClickAwayListener
                    onClickAway={() =>
                        this.grapick.getSelected()
                            ? this.grapick.getSelected().deselect()
                            : null
                    }
                >
                    <div>
                        {this.state.handlerToPickColor && (
                            <div
                                className={classes.colorPicker}
                                style={{
                                    left: `calc(${this.state.handlerToPickColor.getPosition()}% - 100px)`,
                                }}
                            >
                                <SolidColorPicker
                                    color={parseRGBAString(
                                        this.state.handlerToPickColor.getColor()
                                    )}
                                    onChangeComplete={color =>
                                        this.state.handlerToPickColor.setColor(
                                            toRGBAString(color.rgb)
                                        )
                                    }
                                />
                            </div>
                        )}
                        <div
                            className={classes.colorStopPicker}
                            ref={this.pickerElementRef}
                        ></div>
                    </div>
                </ClickAwayListener>
                <div className={classes.controlsSection}>
                    <GradientTypePicker
                        className={classes.margin}
                        value={color.type}
                        onChange={this.gradientTypeChanged}
                    />
                    {color.type === GradientType.linear && (
                        <AngleSelector
                            className={classes.margin}
                            value={color.param.angle}
                            onChange={v => this.angleChanged(v.value)}
                        />
                    )}
                    {color.type === GradientType.radial && (
                        <React.Fragment>
                            <RadialShapePicker
                                className={classes.margin}
                                value={color.param.shape}
                                onChange={this.radialShapedChanged}
                            />
                            <div className={classes.controlsSection}>
                                <RadialSizeInput
                                    shape={color.param.shape}
                                    className={classes.margin}
                                    value={color.param.size}
                                    onChange={val =>
                                        this.radialSizeChanged(val)
                                    }
                                />
                            </div>
                            <div className={classes.controlsSection}>
                                <RadialPositionInput
                                    className={classes.margin}
                                    value={color.param.position}
                                    onChange={val =>
                                        this.radialPositionChanged(val)
                                    }
                                />
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        )
    }
}

export const GradientColorPicker = decorator(Picker)
