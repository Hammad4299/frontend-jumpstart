//Usage example for custom component
import { AppSelectProps, AppSelect } from ".";
import { StandardProps, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { StyleClassKey } from "js/react/typescript";
import { KnownKeys } from "js/typescript";
import { defaultTo } from "lodash-es";
import React, { useMemo } from "react";
import { ValueType } from "react-select/src/types";

const useStyles = makeStyles((theme: Theme) => ({
    select: {
        marginTop: theme.spacing(-0.5),
    },
    selectLabel: {
        marginTop: theme.spacing(-0.8),
    },
}));

export type OrderTypeDropdownClassKey = StyleClassKey<typeof useStyles>;

type OrderTypeAppSelectProps = AppSelectProps<OptionType>;

const OrderTypeAppSelect = (AppSelect as any) as React.ComponentType<OrderTypeAppSelectProps>;

type OptionType = {
    name: string;
    value: number;
};

interface OrderTypeDropdownProps
    extends StandardProps<{}, OrderTypeDropdownClassKey>,
        Omit<
            Pick<OrderTypeAppSelectProps, KnownKeys<OrderTypeAppSelectProps>>,
            "value" | "onChange"
        > {
    value?: number | number[];
    onChange?: (value: number | number[]) => void;
}

export function OrderTypeDropdown(props: OrderTypeDropdownProps) {
    const { value, isMulti, options: wasted, onChange: _, ...rest } = props;

    function onChangeInternal(newVal: ValueType<OptionType>) {
        const { onChange } = props;
        if (props.isMulti) {
            const v = newVal as OptionType[];
            onChange(v ? v.map((x) => x.value) : []);
        } else {
            const v = defaultTo(newVal as OptionType, null);
            onChange(v ? v.value : null);
        }
    }

    const options: OptionType[] = useMemo(
        () =>
            [1, 2].map((x) => ({
                name: x.toString(),
                value: x,
            })),
        [],
    );

    const selectedOptions = useMemo(() => {
        if (props.isMulti) {
            return options.filter((x) => (value as number[]).includes(x.value));
        } else {
            return options.find((x) => value === x.value);
        }
    }, [options, value]);

    return (
        <OrderTypeAppSelect
            value={selectedOptions}
            fullWidth
            defaultOptions
            isClearable={false}
            options={options}
            isMulti={isMulti}
            onChange={onChangeInternal}
            getOptionLabel={(o) => o.name}
            getOptionValue={(o) => o.value.toString()}
            {...rest}
        />
    );
}
OrderTypeDropdown.defaultProps = {
    isMulti: false,
    onChange: () => {},
};

export default OrderTypeDropdown;
