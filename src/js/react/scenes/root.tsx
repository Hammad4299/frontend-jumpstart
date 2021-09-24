import { routesForContext } from "../../routing";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Snackbar, Typography } from "@material-ui/core";
import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

// import { Sample } from "./sample";

library.add(faFilter);

const routes = routesForContext();
const Root = () => (
    // <ContextManager>
    <React.Fragment>
        <Typography>Tesssdst</Typography>
        {/* <PhoneInput onChange={() => {}} value={""} /> */}

        <Switch>{/* <Route component={Sample} /> */}</Switch>
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
