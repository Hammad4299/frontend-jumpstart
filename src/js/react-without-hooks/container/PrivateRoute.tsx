/**
 * Created by talha on 5/15/2018.
 */
import React from 'react';
import {Route, Redirect, RouteProps} from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
    
}

const PrivateRoute = ({  render, component:Component, ...rest }:PrivateRouteProps) => {
    const authorized = true;
    return (
        <Route
            {...rest}
            render={props => {
                    return (
                        authorized ?
                            <Route component={Component} render={render} /> : 
                            <Redirect to={{
                                    pathname: '/unauthorized',
                                    state: { from: props.location }
                                }}
                            />
                    )
                }
            }
        />
    )
};

export default PrivateRoute;