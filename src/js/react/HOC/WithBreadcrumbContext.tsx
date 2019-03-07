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

    interface Props extends Mapped {
    }

    type Mapped = MappedProps & MappedDispatch;
    type ComponentProps = Subtract<WrappedProps, WithBreadcrumbContextInjectedProps>;
    type OwnProps = Subtract<Props, Mapped> & ComponentProps;   //Props that are allowed to passed from Resulting component returned from HOC.
    type HOCProps = Mapped;

    const sfc = ({breadcrumbContext, ...rest}:HOCProps) => {
        const tsBypass:WrappedProps = rest as any;
        return (
            <WrappedComponent breadcrumbContext={breadcrumbContext} {...tsBypass} />
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