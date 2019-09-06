/**
 * Created by talha on 5/15/2018.
 */
import React from "react"
import { RoutingContext } from "../../routing"
import { useRoutingContext } from "../hooks"

export interface WithRoutingContextInjectedProps {
    routingContext?: RoutingContext
}

export function withRoutingContext<
    WrappedProps extends WithRoutingContextInjectedProps
>(WrappedComponent: React.ComponentType<WrappedProps>) {
    function WithRoutingContext(props: WrappedProps) {
        const [routingContext] = useRoutingContext()
        return <WrappedComponent routingContext={routingContext} {...props} />
    }

    return WithRoutingContext
}

export default withRoutingContext
