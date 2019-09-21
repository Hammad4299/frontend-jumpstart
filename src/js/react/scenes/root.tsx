import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { routesForContext } from "../../routing";
import { Snackbar } from "@material-ui/core";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Sample } from "./sample";
import { PhoneInput, AddressField } from "components";
library.add(faFilter);

const routes = routesForContext();
const Root = () => (
    // <ContextManager>
    <React.Fragment>
        <PhoneInput onChange={() => {}} value={""} />
        <AddressField  />
        <Switch>
            <Route component={Sample} />
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
