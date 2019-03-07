import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
// import { ContextManager } from '../container';
import { routesForContext } from 'routing';
import { Snackbar } from "@material-ui/core";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
library.add(faFilter)

const routes = routesForContext();
const Root = () => (
    // <ContextManager>
        <React.Fragment>
            <Switch>
                
            </Switch>
            {/* <Snackbar
                open={this.props.snackbarData.open}
                autoHideDuration={6000}
                onClose={()=>this.props.closeSnackbar()}
                message={this.props.snackbarData.message}
                /> */}
        </React.Fragment>
    // </ContextManager>
);

export default Root;