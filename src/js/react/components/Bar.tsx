import React from "react"
import { Theme, StandardProps, Typography, WithTheme } from "@material-ui/core"
import { withStyles, createStyles } from "@material-ui/styles"
import classNames from "classnames"
import { StylesType, StyleClassKey } from "../typescript"

const styles = (theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            alignItems: "center",
        },
        bar: {
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            position: "relative",
        },
        filledBar: {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            overflow: "hidden",
            transition: "width 1s",
            display: "flex",
            alignItems: "center",
            "& $barText": {
                zIndex: 1,
                marginLeft: theme.spacing(2),
            },
        },
        barText: {},
        textVal: {
            marginLeft: theme.spacing(1),
            width: 70,
            textAlign: "right",
        },
    })

type BarClassKey = StyleClassKey<typeof styles>

const finalStyles: StylesType<BarClassKey> = styles as any

const decorator = withStyles(finalStyles)

export interface BarProps extends StandardProps<{}, BarClassKey> {
    max?: number
    value: number
    backgroundColor: React.CSSProperties["backgroundColor"]
    barColor: React.CSSProperties["backgroundColor"]
    height: React.CSSProperties["height"]
}

function Component(props: BarProps) {
    const { value, max, className, classes, ...rest } = props

    return (
        <div className={classNames(classes.root, className)}>
            <div
                className={classes.bar}
                style={{
                    height: rest.height,
                    backgroundColor: rest.backgroundColor,
                }}
            >
                <div
                    style={{
                        width: `${(value * 100) / max}%`,
                        backgroundColor: rest.barColor,
                    }}
                    className={classes.filledBar}
                ></div>
            </div>
        </div>
    )
}

Component.defaultProps = {
    max: 100,
}
Component.displayName = "Bar"

export const Bar = decorator(Component)
export default Bar
