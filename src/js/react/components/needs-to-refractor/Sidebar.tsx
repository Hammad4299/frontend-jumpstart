import {Theme, WithStyles} from "@material-ui/core";
import Drawer, {DrawerProps} from '@material-ui/core/Drawer';
import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import Hidden from "@material-ui/core/Hidden/Hidden";
import createStyles from "@material-ui/core/styles/createStyles";

const styles = (theme:Theme) => createStyles({
    drawerPaper: {
        flexGrow: 1,
        overflowY: 'auto',
        height: 'auto',
        minHeight: '100vh',
        position: 'relative' as 'relative',
        width: theme.drawer.width,
        [theme.breakpoints.down(theme.drawer.breakpoint)] : {
            position: 'fixed' as 'fixed',
            paddingTop: '0px',
            height: '100vh'
        }
    },
    root: {
        '& ul': {
            paddingLeft: theme.spacing(2)
        }
    },
    fullHeight: {
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.down(theme.drawer.breakpoint)] : {
            display: 'none',
        }
    }
});

const decorator = withStyles(styles);

type StyledDrawerProps = DrawerProps & WithStyles<typeof styles>;

function Sidebar(props:StyledDrawerProps)  {
    const {children,classes,...rest} = props;
    return (
        <React.Fragment>
            <Hidden lgUp>
                <Drawer
                    variant="temporary"
                    anchor={'left'}
                    {...rest}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {children}
                </Drawer>
            </Hidden>
            <Hidden mdDown implementation="css" className={classes.fullHeight}>
                    <Drawer
                        style={{flexGrow:1}}
                        className={classes.fullHeight}
                        variant={'permanent'}
                        {...rest}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {children}
                    </Drawer>
            </Hidden>
        </React.Fragment>
    );
};

export default decorator(Sidebar);