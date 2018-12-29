import { RGBColor } from "react-color";
import { toNumber } from "shared";


export type Color = RGBColor;


export function toRGBAString(color:Color) {
    const a = `rgba(${color.r},${color.g},${color.b},${color.a})`;
    return a;
}


export function parseRGBAString(color:string):Color {
    const regex = /rgba?\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,?\s*([0-9\.]+)?\s*\)/g;
    const res = regex.exec(color);
    let b:Color = null;
    if(res && res.length>=4) {
        b = {
            r: toNumber(res[1]),
            g: toNumber(res[2]),
            b: toNumber(res[3]),
            a: toNumber(res[4])
        }
    }

    return b;
}