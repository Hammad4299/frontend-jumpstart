import { RoutingContext } from "../../routing";
import { SetRoutingContextAction } from "./types";

export function setRoutingContext(
    params: RoutingContext
): SetRoutingContextAction {
    return {
        type: "routing_set_context",
        context: params
    };
}
