import { useSelector, useDispatch } from "react-redux";
import { AppStore, SetRoutingContextAction } from "../../redux-store";
import { Dispatch } from "redux";

export function useRoutingContext() {
    const context = useSelector(
        (store: AppStore) => store.routing.routingContext
    );
    const dispatch = useDispatch<Dispatch<SetRoutingContextAction>>();
    return [context, dispatch];
}
