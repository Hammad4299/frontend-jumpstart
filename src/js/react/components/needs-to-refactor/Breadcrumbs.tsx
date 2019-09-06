import React from "react"
import { lighten } from "@material-ui/core/styles/colorManipulator"
import {
    Theme,
    WithStyles,
    List,
    ListItem,
    ListItemIcon,
} from "@material-ui/core"
import withStyles from "@material-ui/core/styles/withStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { BreadcrumbInfo } from "models/Breadcrumbs"
import { Link } from "react-router-dom"
import { ReactNode } from "react"
import HomeIcon from "@material-ui/icons/Home"
import { ListItemText } from "@material-ui/core"

const styles = (theme: Theme) =>
    createStyles({
        item: {
            fontSize: theme.typography.caption.fontSize,
            padding: "0px",
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
        slash: {
            fontSize: theme.typography.caption.fontSize,
            padding: "0px",
        },
        text: {
            padding: "0px",
        },
        root: {
            display: "flex",
            flexWrap: "wrap",
            "& $item": {
                width: "auto",
            },
            "& $slash": {
                width: "auto",
            },
        },
        icon: {
            marginRight: "0px",
        },
    })

const decorator = withStyles(styles)

export interface BreadcrumbsProps {
    breadcrumbs: BreadcrumbInfo[]
}

type StyledProps = BreadcrumbsProps & WithStyles<typeof styles>

function Breadcrumbs({ classes, breadcrumbs, ...rest }: StyledProps) {
    const items = breadcrumbs
        .map((item, index) => (
            <ListItem
                className={classes.item}
                key={item.type}
                {...{ to: item.route }}
                component={Link}
                title={item.name}
            >
                {index === 0 ? (
                    <ListItemIcon className={classes.icon}>
                        <HomeIcon />
                    </ListItemIcon>
                ) : (
                    <ListItemText className={classes.text}>
                        {item.name}
                    </ListItemText>
                )}
            </ListItem>
        ))
        .reduce((nodes: ReactNode[], current: ReactNode) => {
            if (nodes.length > 0) {
                nodes.push(
                    <ListItem
                        className={classes.slash}
                        key={`separate${nodes.length}`}
                    >
                        {" "}
                        /{" "}
                    </ListItem>
                )
            }
            nodes.push(current)
            return nodes
        }, [])
    return <List className={classes.root}>{items}</List>
}

export default decorator(Breadcrumbs)
