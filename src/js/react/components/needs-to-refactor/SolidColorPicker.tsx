import React from "react";
import { SketchPicker, SketchPickerProps } from "react-color";

type Props = SketchPickerProps;

export function SolidColorPicker(props: Props) {
    const { presetColors = [], color = "#ff0", ...rest } = props;
    return <SketchPicker presetColors={presetColors} color={color} {...rest} />;
}

export default SolidColorPicker;
