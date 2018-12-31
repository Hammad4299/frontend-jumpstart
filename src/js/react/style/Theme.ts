import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import React from "react";
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

declare module '@material-ui/core/styles/createMuiTheme' {  //custom theme options typings
    interface Theme extends ThemeOptions{

    }
    interface ThemeOptions {
        drawer?: {
            breakpoint: Breakpoint,
            width: React.CSSProperties['width']
        },
        header?: {
            height: React.CSSProperties['height']
        },
    }
}

function createAppTheme(options: ThemeOptions) {
    const theme = createMuiTheme({
        typography: {
            ...{
                useNextVariants: true
            } as any,
        }
    });
    return createMuiTheme({
        typography: {
            ...{
                useNextVariants: true
            } as any,
            fontFamily:  'Roboto, Helvetica, Arial, sans-serif'
        },
        drawer: {
            breakpoint: 'md',
            width: '300px'
        },
        header: {
            height: '80px'
        },
        palette: {
            primary: {
                main: '#4680fe',
            },
            text: {
                primary: '#000',
            },
            background: {
                default: '#f6f7fb',
                paper: '#fff'
            },
            common: {
                black: '#000'
            },
            grey: {
                "300": '#f2f2f2'
            }
        },
        zIndex: {
            tooltip: 1
        },
        ...options
    })
}

const theme = createAppTheme({

});

export default theme;