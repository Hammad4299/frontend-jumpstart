/**
 * Created by talha on 5/15/2018.
 */
import React from "react";
import { BreadcrumbContextContract } from "breadcrumbs";
import { useBreadcrumbContext } from "custom-hooks";

export interface WithBreadcrumbContextInjectedProps {
    breadcrumbContext?: BreadcrumbContextContract;
}

export function withBreadcrumbContext<
    WrappedProps extends WithBreadcrumbContextInjectedProps
>(WrappedComponent: React.ComponentType<WrappedProps>) {
    function WithBreadcrumbContext(props: WrappedProps) {
        const [breadcrumbContext] = useBreadcrumbContext();
        return (
            <WrappedComponent
                breadcrumbContext={breadcrumbContext}
                {...props}
            />
        );
    }

    return WithBreadcrumbContext;
}

export default withBreadcrumbContext;
