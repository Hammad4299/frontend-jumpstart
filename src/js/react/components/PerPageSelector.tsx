import React, { ReactNode } from "react";
import { Theme, Typography, StandardProps } from "@material-ui/core";
import { withStyles, createStyles } from "@material-ui/styles";
import { AppSelect, SimpleOption } from "./";
import { StyleClassKey } from "../typescript";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            alignItems: "center"
        }
    });

export type PerPageSelectorClassKey = StyleClassKey<typeof styles>;

export interface PerPageSelectorProps
    extends StandardProps<{}, PerPageSelectorClassKey> {
    selected?: number;
    before?: ReactNode;
    after?: ReactNode;
    allowed?: number[];
    onChange: (perPage: number) => void;
}

const decorator = withStyles(styles);

function Component({
    classes,
    onChange = () => {},
    allowed = [10, 25, 50, 100],
    before = <Typography>Show&nbsp;</Typography>,
    after = <Typography>&nbsp;entries</Typography>,
    ...rest
}: PerPageSelectorProps) {
    return (
        <div className={classes.root}>
            {before}
            <AppSelect
                value={{
                    label: rest.selected.toString(),
                    value: rest.selected
                }}
                isSearchable={false}
                onChange={(val: SimpleOption) => onChange(val.value)}
                options={allowed.map(item => ({
                    label: item.toString(),
                    value: item
                }))}
            />
            {after}
        </div>
    );
}

export const PerPageSelector = decorator(Component);
export default PerPageSelector;
