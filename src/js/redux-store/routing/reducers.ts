import { RoutingState, RoutingActions } from "./types"
import { BaseRoutingContext } from "../../routing"

export function routingStateReducer(
    previous: RoutingState,
    action: RoutingActions
): RoutingState {
    previous = previous || {
        routingContext: new BaseRoutingContext(),
    }
    switch (action.type) {
        case "routing_set_context":
            previous = {
                ...previous,
                routingContext: action.context,
            }
            break
    }

    return previous
}
