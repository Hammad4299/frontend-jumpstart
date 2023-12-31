import { RoutingContext } from "../../routing";

export interface RoutingState {
    routingContext: RoutingContext;
}

export interface SetRoutingContextAction {
    type: "routing_set_context";
    context: RoutingContext;
}

export type RoutingActions = SetRoutingContextAction;
