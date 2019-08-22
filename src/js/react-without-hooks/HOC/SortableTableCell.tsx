import React, { ReactNode } from "react";
import { TableCellProps } from "@material-ui/core/TableCell";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import TableSortLabel, { TableSortLabelProps } from "@material-ui/core/TableSortLabel";
import { ColumnSort, getToggledSortDirection } from "types";

export function sortableTableCell<T extends TableCellProps>(Component:React.ComponentType<T>) {
    interface Props {
        isNumeric?:boolean
        sortLabelProps?:TableSortLabelProps
        tooltipProps?:TooltipProps
        sort:ColumnSort
        onSortChanged:(sort:ColumnSort)=>void
    }

    interface State {
    }

    type HOCProps = OwnProps;
    type OwnProps = Props & T;   //Props that are allowed to passed from Resulting component returned from HOC.

    return class extends React.PureComponent<HOCProps,State> {
        constructor(props:HOCProps) {
            super(props);
            this.state = {
            };
        }
    
        render(){
            const { isNumeric = false, tooltipProps, sortLabelProps, sort, onSortChanged = ()=>{}, ...rest} = this.props;
            const {children, ...cellProps} = rest;
            const tsBypass:T = cellProps as any;
            
            return (
                <Component {...tsBypass} sortDirection={sort.dir !== 'none' ? sort.dir : false}>
                    <Tooltip title="Sort"
                        placement={isNumeric ? 'bottom-end' : 'bottom-start'}
                        enterDelay={300}>
                        <TableSortLabel
                            active={sort.dir !== 'none'}
                            direction={sort.dir!=='none' ? sort.dir : 'asc'}
                            onClick={()=>
                                onSortChanged({
                                    ...sort,
                                    dir: getToggledSortDirection(sort.dir)
                                })
                            }>
                            {children}
                        </TableSortLabel>
                    </Tooltip>
                </Component>
            )
        }
    }
}

export default sortableTableCell;