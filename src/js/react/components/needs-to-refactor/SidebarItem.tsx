import {
    Theme,
    WithStyles,
    ListItemIcon,
    ListItemAvatar,
    IconButton,
    PropInjector,
} from "@material-ui/core"
import withStyles, { CSSProperties } from "@material-ui/core/styles/withStyles"
import ListItem, { ListItemClassKey } from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import React from "react"
import ISidebarItem from "interfaces/ISidebarItem"
import ExpandLess from "@material-ui/icons/ExpandLess"
import Collapse from "@material-ui/core/Collapse"
import ExpandMore from "@material-ui/icons/ExpandMore"
import createStyles from "@material-ui/core/styles/createStyles"
import { NavLink } from "react-router-dom"
import classNames from "classnames"
import { StylesType, StyleClassKeys } from "interfaces/Types"

const styles = (theme: Theme) =>
    createStyles({
        itemContent: {
            width: "100%",
            display: "flex",
            alignItems: "center",
        },
        root: {
            "&$active": {
                backgroundColor: theme.palette.grey["200"],
            },
        },
        active: {},
    })

const x: StylesType<
    StyleClassKeys<typeof styles> | ListItemClassKey
> = styles as any

type Styled = WithStyles<typeof styles>
const decorator = withStyles(x)

export default interface SidebarItem extends ListItemProps {
    childs?: SidebarItem[]
    hasChilds: boolean
    loaded?: boolean
    active?: boolean
    icon?: ReactNode
    expanded?: boolean
    route?: string
    itemClicked?: (item: SidebarItem) => void
    expandClicked?: (
        e: React.MouseEvent<HTMLElement>,
        item: SidebarItem
    ) => void
    identifier: string
}

type StyledSidebarItemProps = ISidebarItem & Styled

function SidebarItem(props: StyledSidebarItemProps) {
    const {
        childs,
        active,
        expandClicked = () => {},
        classes,
        children,
        expanded,
        icon,
        hasChilds,
        identifier,
        route = null,
        itemClicked = () => {},
        loaded,
        accessRequirement,
        ...rest
    } = props
    const other = {
        to: route,
    }

    return (
        <React.Fragment>
            <ListItem
                className={classNames(classes.root, {
                    [classes.active]: active,
                })}
                {...other}
                component={route ? NavLink : "li"}
                dense
                {...rest}
                onClick={() => (itemClicked ? itemClicked(props) : null)}
            >
                <div className={classes.itemContent}>
                    {icon}
                    <ListItemText title={props.title}>
                        {props.title}
                    </ListItemText>
                    {hasChilds ? (
                        <IconButton
                            onClick={e => expandClicked(e, props)}
                            style={{
                                padding: "0px",
                            }}
                        >
                            {expanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    ) : null}
                </div>
            </ListItem>
            {hasChilds ? (
                <Collapse in={expanded} unmountOnExit={true}>
                    {children}
                </Collapse>
            ) : null}
        </React.Fragment>
    )
}

export default decorator(SidebarItem)
