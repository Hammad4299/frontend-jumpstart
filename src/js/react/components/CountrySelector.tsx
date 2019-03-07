import React from 'react';
import { createStyles, Theme, withStyles, WithStyles, StandardProps } from "@material-ui/core";
import { getData } from 'country-list';
import { defaultTo } from 'lodash-es';
import { StyleClassKey, StylesType } from 'typehelper';
import { AppSelectClassKey, AppSelectProps, AppSelect, SimpleOption } from 'components';

const countries = getData();

const styles = (theme:Theme) => createStyles({
});

export type CountrySelectorClassKey = StyleClassKey<typeof styles>|AppSelectClassKey;

export interface CountrySelectorProps extends StandardProps<AppSelectProps,CountrySelectorClassKey> {
    country:string
    onCountrySelected:(country:string)=>void
}

const decorator = withStyles(styles as StylesType<CountrySelectorClassKey>);

function Component(props:CountrySelectorProps) {
    let { onCountrySelected = ()=>{}, country, ...rest } = props;
    const opts = countries.map(country=>({
        label:country.name,
        value:country.name
    }))
    country = defaultTo(country, '');
    return (
        <AppSelect
            value={{
                label: country,
                value: country
            }}
            onChange={(val:SimpleOption)=>onCountrySelected(val.value)}
            isSearchable={true}
            options={opts}
            {...rest}
        />
    )
}

export const CountrySelector = decorator(Component);
export default CountrySelector;