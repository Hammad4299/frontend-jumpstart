import React, { ReactNode } from 'react';
import {createStyles, Theme, withStyles, WithStyles, Typography, StandardProps} from "@material-ui/core";
import Slider, {SliderProps, SliderClassKey} from '@material-ui/lab/Slider';
import { StyleClassKey, StylesType } from 'typehelper';

const styles = (theme: Theme) => createStyles({
    slider: {
        flexGrow: 1
    },
    container: {
        padding: '22px 0px',
    },
    track: {
        height: "12px"
    },
    thumb: {
        width: '18px',
        height: '18px',
    },
    trackBefore: {
        backgroundColor: "#afafaf"
    },
    trackAfter: {
        backgroundColor: "#e4e4e4"
    }
});

type AppSliderClassKey = StyleClassKey<typeof styles>|SliderClassKey

interface AppSliderProps extends StandardProps<SliderProps, AppSliderClassKey> {
}

const sliderStyle:StylesType<AppSliderClassKey> = styles as any;

const decorator = withStyles(sliderStyle);

function Component(props: AppSliderProps) {
    const { classes, min, max, ...rest } = props;
    const { slider,...restClasses } = classes;
    return (
        <Slider
            className={classes.slider}
            classes={restClasses}
            min={min}
            max={max}
            {...rest}
        />
    )
}
Component.defaultProps = {
    min: 0,
    max: 100
} as AppSliderProps
Component.displayName = 'AppSlider';
export const AppSlider = decorator(Component);
export default AppSlider;