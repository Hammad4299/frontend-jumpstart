import { RoutingContext } from "routing";

export enum RoutingActions {
    SET_ROUTING_CONTEXT = 'routing_set_context'
}

export function setRoutingContext(params: RoutingContext) {
    return {
        type: RoutingActions.SET_ROUTING_CONTEXT,
        context: params
    };
}