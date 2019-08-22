import React from "react";
import {List,ListItem, Theme, Typography, StandardProps} from "@material-ui/core";
import { withStyles, createStyles }from "@material-ui/styles";
import {ListItemProps} from "@material-ui/core/ListItem";
import { StyleClassKey } from "typehelper";
import { PaginationInfo, extractPaginationDetail, getPagesRange } from "types";

const styles = (theme:Theme) => createStyles({
    root: {
        display: 'flex',
        flexGrow: 1,
        flexDirection:'row'
    },
    item: {
        padding: theme.spacing(1.5),
        height: '32px',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        borderLeft: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderTop: `1px solid ${theme.palette.divider}`,
        '&:last-child': {
            borderRight: `1px solid ${theme.palette.divider}`,
        },
        '&$selected': {
            background: theme.palette.primary.main,
        }
    },
    selected: {
    }
});

export type PaginationClassKey = StyleClassKey<typeof styles>;

export interface PaginationProps extends StandardProps<{}, PaginationClassKey>{
    info?:PaginationInfo
    propsForPage?:(page:number)=>ListItemProps
}

const decorator = withStyles(styles);

function Component({classes, propsForPage = () => ({}), ...rest}:PaginationProps) {
    const renderButton = (page:number, text:string|number, lprops:ListItemProps)=>{
        return (
            <ListItem key={`${page}|${text}`} classes={{
                root: classes.item,
                selected: classes.selected
            }} {...lprops} button={true as any} {...propsForPage(page)}>
                <Typography>{text}</Typography>
            </ListItem>
        )
    };

    const detail = rest.info ? extractPaginationDetail(rest.info) : null;
    const range = detail ? getPagesRange(detail.current_page,detail.totalPages) : [];
    return (
        <List className={classes.root}>
            {renderButton(detail.current_page-1, "Previous", {
                disabled: detail.current_page<=1
            })}
            {range.map(page=>
                renderButton(page, page, {
                    selected: page===detail.current_page
                })
            )}
            {renderButton(detail.current_page+1, "Next", {
                disabled: detail.current_page>=detail.totalPages
            })}
        </List>
    )
}

export const Pagination = decorator(Component);
export default Pagination;