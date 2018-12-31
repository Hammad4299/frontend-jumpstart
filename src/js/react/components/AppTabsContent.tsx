import React, {} from 'react';
import SwipeableViews, { SwipeableViewsProps } from 'react-swipeable-views';
import { createStyles, withStyles, WithStyles } from "@material-ui/core";

const styles = () => createStyles({
    root: {
    },
});

interface Props extends SwipeableViewsProps {
 
}


const decorator = withStyles(styles);

type StyledProps = WithStyles<typeof styles> & Props;

function AppTabsContent (props:StyledProps) {
    const {classes, children, ref, ...rest} = props;

    return (
        <SwipeableViews className={classes.root} {...rest}>
            {children}
        </SwipeableViews>
    )
}

export default decorator(AppTabsContent);