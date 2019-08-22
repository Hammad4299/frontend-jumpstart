import { RoutingContext } from "routing";
import { SetRoutingContentAction } from "./types";


export function setRoutingContext(params: RoutingContext):SetRoutingContentAction {
    return {
        type: 'routing_set_context',
        context: params
    };
}