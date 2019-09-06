import {Theme, Typography, StandardProps} from "@material-ui/core";
import React, {ReactNode} from "react";
import { withStyles, createStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import Table, { TableClassKey } from "@material-ui/core/Table";
import {TableProps} from "@material-ui/core/Table";
import { StyleClassKey, StylesType } from "../typescript";
import { PaginationInfo, extractPaginationDetail } from "../../types";
import { PerPageSelectorProps, PaginationProps, PerPageSelector, Pagination } from "./";

const styles = (theme:Theme) => createStyles({
    paper: {
        color: theme.palette.text.primary
    },
    rightContainer: {
        display: 'flex'
    },
    table: {
        fontWeight: 'bold',
        borderColor: theme.palette.divider
    },
    tableTopToolbar: {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(1)
    },
    perPageContainer: {
        flexGrow: 1
    }
});

export type AppTableClassKey = StyleClassKey<typeof styles>|TableClassKey;

export interface AppTableProps extends StandardProps<TableProps, AppTableClassKey> {
    perPageProps?:PerPageSelectorProps,
    paginationInfo?:PaginationInfo,
    rightToolContainer?:ReactNode,
    paginationProps?:PaginationProps
}

const decorator = withStyles(styles as StylesType<AppTableClassKey>);

function Component({rightToolContainer, paginationInfo, paginationProps, perPageProps, classes, ...rest}:AppTableProps)  {
    const {rightContainer,perPageContainer, tableTopToolbar, paper, table, ...restClasses} = classes;
    
    const detail = paginationInfo ? extractPaginationDetail(paginationInfo) : null;
    
    return (
        <Paper className={paper} elevation={0}>
            <div className={tableTopToolbar}>
                <div className={perPageContainer}>
                    {detail ? <PerPageSelector selected={detail.per_page} {...perPageProps} /> : null}
                </div>
                <div className={rightContainer}>
                    {rightToolContainer}
                </div>
            </div>
            <Table {...{border:1}} className={table} {...rest} classes={restClasses}>
            </Table>
            <div className={tableTopToolbar}>
                <Typography className={perPageContainer}>
                    {detail && paginationInfo.total>0 ? `Showing ${detail.startingItem} to ${detail.endingItem} of ${detail.total} entries` : null}
                </Typography>
                <div>
                    {paginationInfo && paginationInfo.total>0 ? <Pagination info={paginationInfo} {...paginationProps} /> : null}
                </div>
            </div>
        </Paper>
    );
};

Component.displayName = 'AppTable';
Component.defaultProps = {
    paginationProps: {}
} as AppTableProps

export const AppTable = decorator(Component);
export default AppTable;