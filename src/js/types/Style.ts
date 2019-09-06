import { UploadedFile } from "../models"
import { RGBColor } from "react-color"
import { toNumber } from "lodash-es"
import WebFont from "webfontloader"

const loadedFontFamilies: { [family: string]: boolean } = {}

type PositiveUnits = "px"
type RelativeUnits = never
type Percentage = "%"

export type Color = RGBColor

export enum BackgroundType {
    image = "image",
    solidColor = "solid_color",
    gradientColor = "gradient",
}

export type ImageBackground = {
    file: UploadedFile
}

interface GenericBackground<T> {
    type: BackgroundType
    value: T
}

export type FontVariant = {
    bold: boolean
    italic: boolean
}

export interface Font {
    family: string
}

export interface FontWithVariants extends Font {
    variants: FontVariant
}

export interface BackgroundImage extends GenericBackground<ImageBackground> {
    type: BackgroundType.image
}

export interface SolidBackground extends GenericBackground<Color> {
    type: BackgroundType.solidColor
}

export interface GradientBackground extends GenericBackground<GradientColor> {
    type: BackgroundType.gradientColor
}

export type Background = BackgroundImage | SolidBackground | GradientBackground

export enum GradientType {
    linear = "linear",
    radial = "radial",
}

export enum RadialGradientShape {
    auto = "auto",
    circle = "circle",
    ellipse = "ellipse",
}

export enum RadialGradientSizeType {
    closestCorner = "closest-corner",
    closestSide = "closest-side",
    farthestSide = "farthest-side",
    farthestCorner = "farthest-corner",
}

export type GradientDirection = string

export type RadialGradientPosition = {
    first: UnitValue<Percentage | PositiveUnits>
    second: UnitValue<Percentage | PositiveUnits>
}

export interface GradientStop {
    position: UnitValue<Percentage> //percentage
    color: Color
}

export interface UnitValue<TUnit> {
    value: any
    unit: TUnit
}

interface Gradient<T> {
    colorStops: GradientStop[]
    type: GradientType
    param: T
}

export interface LinearGradientColor extends Gradient<LinearGradientParams> {
    type: GradientType.linear
}

interface RadialGradientParams<TSize> {
    shape: RadialGradientShape
    size: TSize
    position: RadialGradientPosition
}

export interface LinearGradientParams {
    angle: UnitValue<"deg">
}

export interface CircleSize {
    radius: UnitValue<PositiveUnits | RelativeUnits | RadialGradientSizeType>
}

export interface EllipseSize {
    radius: UnitValue<PositiveUnits | RelativeUnits | RadialGradientSizeType>
    length: UnitValue<PositiveUnits | RelativeUnits | Percentage>
}

export type RadialGradientSize = CircleSize | EllipseSize

export interface CircleRadialGradientParams
    extends RadialGradientParams<CircleSize> {
    shape: RadialGradientShape.circle
}

export interface AutoRadialGradientParams
    extends RadialGradientParams<CircleSize> {
    shape: RadialGradientShape.auto
}

export interface EllispeRadialGradientParams
    extends RadialGradientParams<EllipseSize> {
    shape: RadialGradientShape.ellipse
}

export type RadialGradientParam =
    | CircleRadialGradientParams
    | EllispeRadialGradientParams
    | AutoRadialGradientParams

export interface RadialGradientColor extends Gradient<RadialGradientParam> {
    type: GradientType.radial
}

export type GradientColor = LinearGradientColor | RadialGradientColor

export function isEllipseSize(size: RadialGradientSize): size is EllipseSize {
    return "length" in size
}

export function isCircleSize(size: RadialGradientSize): size is CircleSize {
    return !("length" in size)
}

export function toRGBAString(color: Color) {
    const a = `rgba(${color.r},${color.g},${color.b},${color.a})`
    return a
}

function getUnitValue<T>(val: UnitValue<T>): string {
    return `${val.value}${val.unit}`
}

function getGradientStop(stop: GradientStop): string {
    return ` ${toRGBAString(stop.color)} ${getUnitValue(stop.position)} `
}

export function parseRGBAString(color: string): Color {
    const regex = /rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,?\s*([0-9.]+)?\s*\)/g
    const res = regex.exec(color)
    let b: Color = null
    if (res && res.length >= 4) {
        b = {
            r: toNumber(res[1]),
            g: toNumber(res[2]),
            b: toNumber(res[3]),
            a: toNumber(res[4]),
        }
    }

    return b
}

export function getBackgroundSolid(config: Color) {
    return {
        backgroundColor: toRGBAString(config),
    }
}

export function getBackgroundImage(config: ImageBackground) {
    return {
        backgroundSize: "cover",
        backgroundImage: `url(${config.file.full_url})`,
    }
}

export function getBackgroundGradient(config: GradientColor) {
    let props: { background?: string } = {}
    const stops = config.colorStops.map(stop => getGradientStop(stop)).join(",")
    const preSizes = Object.keys(RadialGradientSizeType).map(
        key => RadialGradientSizeType[key]
    )
    if (stops.length > 0) {
        if (config.type === GradientType.linear) {
            props = {
                background: `linear-gradient(${getUnitValue(
                    config.param.angle
                )},${stops})`,
            }
        } else {
            const gradDef: string[] = []
            const gradientParams = config.param
            if (gradientParams.shape !== RadialGradientShape.auto) {
                gradDef.push(gradientParams.shape)
            }

            let hasSize = false
            if (preSizes.includes(gradientParams.size.radius.unit)) {
                gradDef.push(gradientParams.size.radius.unit)
                hasSize = true
            } else if (gradientParams.size.radius.value !== "") {
                hasSize = true
                gradDef.push(getUnitValue(gradientParams.size.radius))

                if (gradientParams.shape === RadialGradientShape.ellipse) {
                    if (gradientParams.size.length.value !== "") {
                        gradDef.push(getUnitValue(gradientParams.size.length))
                    }
                }
            }

            if (!hasSize) {
                gradDef.push("farthest-corner")
            }

            if (
                gradientParams.position.first.value !== "" &&
                gradientParams.position.second.value !== ""
            ) {
                gradDef.push("at")
                gradDef.push(getUnitValue(gradientParams.position.first))
                gradDef.push(getUnitValue(gradientParams.position.second))
            }

            props = {
                background: `radial-gradient(${gradDef.join(" ")},${stops})`,
            }
        }
    }

    return props
}

export function getBackground(
    background: Background
): {
    background?: string
    backgroundColor?: string
    backgroundSize?: string
    backgroundImage?: string
} {
    if (background.type === BackgroundType.solidColor) {
        return getBackgroundSolid(background.value)
    } else if (background.type === BackgroundType.gradientColor) {
        return getBackgroundGradient(background.value)
    } else {
        return getBackgroundImage(background.value)
    }
}

export function loadFamily(family: string) {
    if (family && !loadedFontFamilies[family] && family.length > 0) {
        loadedFontFamilies[family] = true
        WebFont.load({
            google: {
                families: [family],
            },
        })
    }
}

export function getFontStyle(font: FontWithVariants, triggerLoad = true) {
    if (triggerLoad) {
        loadFamily(font.family)
    }
    return {
        fontFamily: font.family,
        fontWeight: font.variants && font.variants.bold ? 700 : 100,
        fontStyle: font.variants && font.variants.italic ? "italic" : "",
    }
}
