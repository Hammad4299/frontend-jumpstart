import React, { ReactNode } from "react"
import {
    createStyles,
    Theme,
    withStyles,
    WithStyles,
    IconButton,
} from "@material-ui/core"
import { Close as CloseIcon } from "@material-ui/icons"
import { darken } from "@material-ui/core/styles/colorManipulator"
import classNames from "classnames"

const styles = (theme: Theme) =>
    createStyles({
        boxContainer: {
            position: "relative",
        },
        margins: {
            marginRight: theme.spacing(3),
            marginTop: theme.spacing(3),
        },
        icon: {
            position: "absolute",
            color: "#fff",
            backgroundColor: "red",
            padding: "1px",
            display: "inline-block",
            top: "-14px",
            right: "-14px",
            cursor: "pointer",
            zIndex: 1,
            "&:hover": {
                backgroundColor: darken("#f00", 0.4),
            },
        },
        svgicon: {
            height: "15px",
            width: "15px",
        },
    })

interface Props<T> {
    children: ReactNode
    addMargins?: boolean
    onDelete?: (identifier?: T) => void
    identifier?: T
}

const decorator = withStyles(styles)

type StyledProps<T> = WithStyles<typeof styles> & Props<T>

function Deletable<T>(props: StyledProps<T>) {
    const {
        classes,
        addMargins = true,
        onDelete = () => {},
        children,
        identifier,
        ...rest
    } = props
    return (
        <div
            className={classNames(classes.boxContainer, {
                [classes.margins]: addMargins,
            })}
        >
            <IconButton
                className={classes.icon}
                onClick={() => onDelete(identifier)}
            >
                <CloseIcon className={classes.svgicon} />
            </IconButton>
            <div>{children}</div>
        </div>
    )
}

export default decorator(Deletable)
