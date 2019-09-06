import React, { SVGProps, SVGAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import { defaultsDeep } from 'lodash-es';
import { createStyles, Theme, withStyles, WithStyles } from "@material-ui/core";


const styles = (theme:Theme) => createStyles({
    root: {
    },
    svg: {
    },
    shapeGroup: {
        '&:hover $path': {
        }
    },
    text: {
    },
    path: {
    }
});

interface Color {
    color?:React.CSSProperties['color']
    opacity?:number
}

interface ColorWidth extends Color {
    width: string
}

export enum ButtonShape {
    rectangle = 'rectangle',
    parallelogram = 'parallelogram',
    octagon = 'octagon',
    curved_borders = 'curved_borders',
    rounded = 'rounded_borders'
}

export enum VerticalAlignment {
    top = 'hanging',
    middle = 'middle',
    bottom = 'baseline'
}

export enum HorizontalAlignment {
    left = 'start',
    center = 'middle',
    right = 'end',
}

interface Props {
    background?:Color
    border?:ColorWidth
    color?:React.CSSProperties['color']
    shape?:ButtonShape
    text?:string
    textHorizontalAlignment?:HorizontalAlignment
    textVerticalAlignment?:VerticalAlignment
    textProps?:SVGAttributes<any>
    pathProps?:SVGAttributes<any>
    svgProps?:SVGAttributes<any>
    onClick?:()=>void
}

interface PathInjectedProps extends StyledProps {
    innerProps:SVGAttributes<any>
}

const Rectangle = ({ innerProps }:PathInjectedProps) => {
    return (
        <rect width="351.7" height="93" {...innerProps} />
    )
}

const Parallelogram = ({ innerProps }:PathInjectedProps) => {
    return (
        <polygon points="318.3,91.5 2.1,91.5 33.4,1.7 349.6,1.7 " {...innerProps} />
    )
}

const Octagon = ({ innerProps }:PathInjectedProps) => {
    return (
        <path d="M22.5,91.5h306.7c8.2-8.2,12.8-12.8,21-21v-48c-8.2-8.2-12.8-12.8-21-21H22.5
	c-8.2,8.2-12.8,12.8-21,21v48C9.7,78.7,14.3,83.3,22.5,91.5z" {...innerProps} />
    )
}

const CurvedBorders = ({ innerProps }:PathInjectedProps) => {
    return (
        <path d="M20.8,91.4H331c10.4,0,18.9-8.5,18.9-18.9v-52c0-10.4-8.5-18.9-18.9-18.9H20.8
	C10.3,1.6,1.9,10,1.9,20.5v52C1.9,82.9,10.3,91.4,20.8,91.4z" { ...innerProps } />
    )
}

const RoundedBorders = ({ innerProps }:PathInjectedProps) => {
    return (
        <path d="M46.8,91.4H305c24.8,0,44.9-20.1,44.9-44.9v0c0-24.8-20.1-44.9-44.9-44.9H46.8
	C22,1.6,1.9,21.7,1.9,46.5v0C1.9,71.3,22,91.4,46.8,91.4z" {...innerProps} />
    )
}

const buttons:{[key in ButtonShape]:{
    component:(props:PathInjectedProps)=>ReactNode
    svgProps:SVGAttributes<any>
}} = {
    [ButtonShape.rectangle]: {
        component: Rectangle,
        svgProps: {
            viewBox: "0 0 351.7 93"
        }
    },
    [ButtonShape.parallelogram]: {
        component: Parallelogram,
        svgProps: {
            viewBox: "0 0 351.7 93"
        }
    },
    [ButtonShape.octagon]: {
        component: Octagon,
        svgProps: {
            viewBox: "0 0 351.7 93"
        }
    },
    [ButtonShape.curved_borders]: {
        component: CurvedBorders,
        svgProps: {
            viewBox: "0 0 351.7 93"
        }
    },
    [ButtonShape.rounded]: {
        component: RoundedBorders,
        svgProps: {
            viewBox: "0 0 351.7 93"
        }
    }
};

const decorator = withStyles(styles);

type StyledProps = WithStyles<typeof styles> & Props;

/**
 * For transparent, set opacity of path to 0
 */
function ShapedButton(props:StyledProps) {
    let defaultedProps:StyledProps = defaultsDeep({},props, {
        textHorizontalAlignment: HorizontalAlignment.center,
        textVerticalAlignment: VerticalAlignment.middle,
        text: '',
        svgProps: {},
        textProps: {},
        shape: ButtonShape.rectangle,
        onClick:()=>{},
        background: {
            color: '',
            opacity: 1
        },
        border: {
            width: '0',
            color: '#000',
            opacity: 1
        },
        color: '#000',
        pathProps: {},
    } as StyledProps);
    const { classes, color, text, shape, onClick, textVerticalAlignment, textHorizontalAlignment } = defaultedProps;

    const shapeDef = buttons[shape];

    const path = shapeDef.component({
        ...defaultedProps,
        innerProps: {
            className: classNames(classes.path),
            fill: defaultedProps.background.color,
            fillOpacity: defaultedProps.background.opacity,
            stroke: defaultedProps.border.color,
            strokeOpacity: defaultedProps.border.opacity,
            strokeWidth: defaultedProps.border.width,
            // onClick: onClick,
            ...defaultedProps.pathProps
        }
    });

    const textAlignmentProps = getAlignment(textHorizontalAlignment, textVerticalAlignment);
    return (
        <svg className={classes.svg} {...shapeDef.svgProps} {...defaultedProps.svgProps}>
            <g className={classes.shapeGroup} onClick={onClick}>
                {path}
                <text {...textAlignmentProps} fill={color} {...defaultedProps.textProps}>
                    {text}
                </text>
            </g>
        </svg>
    )
}

function getAlignment(horizontal:HorizontalAlignment, vertical:VerticalAlignment):SVGAttributes<any> {
    let attrs: SVGAttributes<any> = {};
    const vertMap:{[key in VerticalAlignment]:SVGAttributes<any>} = {
        [VerticalAlignment.middle]: {
            y:"50%",
            alignmentBaseline: VerticalAlignment.middle
        },
        [VerticalAlignment.top]: {
            y:"0%",
            alignmentBaseline: VerticalAlignment.top
        },
        [VerticalAlignment.bottom]: {
            y:"100%",
            alignmentBaseline: VerticalAlignment.bottom
        },
    }

    const horiMap:{[key in HorizontalAlignment]:SVGAttributes<any>} = {
        [HorizontalAlignment.left]: {
            x:"0%",
            textAnchor: HorizontalAlignment.left
        },
        [HorizontalAlignment.center]: {
            x:"50%",
            textAnchor: HorizontalAlignment.center
        },
        [HorizontalAlignment.right]: {
            x:"100%",
            textAnchor: HorizontalAlignment.right
        },
    }
    
    return {
        ...horiMap[horizontal],
        ...vertMap[vertical]
    };
}

export default decorator(ShapedButton);

export type ShapedButtonProps = Props;