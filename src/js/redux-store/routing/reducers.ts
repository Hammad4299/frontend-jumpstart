import {AnyAction} from "redux";
import { RoutingState } from "./types";
import { BaseRoutingContext } from "routing";
import { RoutingActions } from "./actions";

export function routingStateReducer(previous:RoutingState, action: AnyAction):RoutingState {
    previous = previous || {
        routingContext: new BaseRoutingContext()
    };
    if(action.type === RoutingActions.SET_ROUTING_CONTEXT) {
        previous = {
            ...previous,
            routingContext: action.context
        };
    }

    return previous;
}