/**
 * Created by talha on 5/15/2018.
 */
import {Subtract} from 'utility-types';
import React from 'react';
import { AppStore } from 'redux-store';
import { connect } from 'react-redux';
import { BreadcrumbContextContract } from 'breadcrumbs';

export interface WithBreadcrumbContextInjectedProps {
    breadcrumbContext?: BreadcrumbContextContract
}

export function withBreadcrumbContext<WrappedProps extends WithBreadcrumbContextInjectedProps>(WrappedComponent:React.ComponentType<WrappedProps>) {
    interface MappedProps {
        breadcrumbContext: BreadcrumbContextContract
    }

    interface MappedDispatch {
    }

    type Mapped = MappedProps & MappedDispatch;
    type ComponentProps = Subtract<WrappedProps, WithBreadcrumbContextInjectedProps>;
    type OwnProps = ComponentProps;
    type HOCProps = Mapped;

    const sfc = ({breadcrumbContext, ...rest}:HOCProps) => {
        return (
            <WrappedComponent breadcrumbContext={breadcrumbContext} {...rest} />
        );
    };

    const mapStateToProps = (store:AppStore, ownProps:OwnProps):MappedProps=>{
        return {
            breadcrumbContext: store.breadcrumbs.context
        };
    }

    const enhancer = connect(mapStateToProps);
    return enhancer(sfc);
};

export default withBreadcrumbContext;