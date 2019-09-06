import { useSelector, useDispatch } from "react-redux";
import { AppStore, SetRoutingContextAction } from "../../redux-store";
import { Dispatch } from "redux";

export function useRoutingContext() {
    let context = useSelector((store:AppStore)=>store.routing.routingContext)
    let dispatch = useDispatch<Dispatch<SetRoutingContextAction>>();
    return [context, dispatch];
}