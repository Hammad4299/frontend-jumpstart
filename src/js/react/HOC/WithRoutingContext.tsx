/**
 * Created by talha on 5/15/2018.
 */
import {Subtract} from 'utility-types';
import React from 'react';
import { AppStore } from 'redux-store';
import { connect } from 'react-redux';
import { RoutingContext } from 'routing';

export interface WithRoutingContextInjectedProps {
    routingContext?: RoutingContext
}

export function withRoutingContext<WrappedProps extends WithRoutingContextInjectedProps>(WrappedComponent:React.ComponentType<WrappedProps>) {   
    interface MappedProps {
        routingContext: RoutingContext
    }

    interface MappedDispatch {
    }

    interface Props extends MappedDispatch, MappedProps {
    }

    type ComponentProps = Subtract<WrappedProps, WithRoutingContextInjectedProps>;
    type OwnProps = Subtract<Props,MappedDispatch & MappedProps> & ComponentProps;
    type HOCProps = Props;
    
    const WithRoutingContext = (props:HOCProps) => {
        const {routingContext, ...rest} = props;

        return (
            <React.Fragment>
                <WrappedComponent routingContext={routingContext} {...rest} />
            </React.Fragment>
        );
    }
    
    const mapStateToProps = (store:AppStore, ownProps:OwnProps):MappedProps => {
        return {
            routingContext: store.routing.routingContext
        };
    }

    const enhancer = connect(mapStateToProps);
    return enhancer(WithRoutingContext);
};

export default withRoutingContext;