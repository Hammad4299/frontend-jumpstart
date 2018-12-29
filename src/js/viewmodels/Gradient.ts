import { Color } from "./Color";

type PositiveUnits = 'px';
type RelativeUnits = never;
type Percentage = '%';

export enum GradientType {
    linear = 'linear',
    radial = 'radial'
}

export enum RadialGradientShape {
    auto = 'auto',
    circle = 'circle',
    ellipse = 'ellipse'
}

export enum RadialGradientSizeType {
    closestCorner = 'closest-corner',
    closestSide = 'closest-side',
    farthestSide = 'farthest-side',
    farthestCorner = 'farthest-corner'
}

export type GradientDirection = string

export type RadialGradientPosition = {
    first: UnitValue<Percentage|PositiveUnits>
    second: UnitValue<Percentage|PositiveUnits>
};

export interface GradientStop {
    position:UnitValue<Percentage> //percentage
    color:Color
}

export interface UnitValue<TUnit> {
    value:any
    unit:TUnit
}

interface Gradient<T> {
    colorStops:GradientStop[]
    type:GradientType
    param:T
}

export interface LinearGradientColor extends Gradient<LinearGradientParams> {
    type: GradientType.linear
}

interface RadialGradientParams<TSize> {
    shape:RadialGradientShape
    size: TSize
    position: RadialGradientPosition
}

export interface LinearGradientParams {
    angle:UnitValue<'deg'>
}

export interface CircleSize {
    radius: UnitValue<PositiveUnits|RelativeUnits|RadialGradientSizeType>
}

export interface EllipseSize {
    radius: UnitValue<PositiveUnits|RelativeUnits|RadialGradientSizeType>
    length: UnitValue<PositiveUnits|RelativeUnits|Percentage>
}

export type RadialGradientSize = CircleSize|EllipseSize;

export interface CircleRadialGradientParams extends RadialGradientParams<CircleSize> {
    shape: RadialGradientShape.circle
}

export interface AutoRadialGradientParams extends RadialGradientParams<CircleSize> {
    shape: RadialGradientShape.auto
}

export interface EllispeRadialGradientParams extends RadialGradientParams<EllipseSize> {
    shape: RadialGradientShape.ellipse
}

export type RadialGradientParam = CircleRadialGradientParams|EllispeRadialGradientParams|AutoRadialGradientParams;

export interface RadialGradientColor extends Gradient<RadialGradientParam> {
    type: GradientType.radial
}

export type GradientColor = LinearGradientColor|RadialGradientColor;

export function isEllipseSize(size:RadialGradientSize):size is EllipseSize {
    return 'length' in size;
}

export function isCircleSize(size:RadialGradientSize):size is CircleSize {
    return !('length' in size);
}