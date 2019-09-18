import { combineReducers, applyMiddleware, createStore } from "redux";
import {
    routingStateReducer,
    breadcrumbStateReducer,
    RoutingState,
    BreadcrumbState,
    BreadcrumbActions,
    RoutingActions
} from "./";
import { BreadcrumbContext } from "../breadcrumbs";
import { BaseRoutingContext } from "../routing";
import thunkMiddleware from "redux-thunk";

interface Store {
    routing: RoutingState;
    breadcrumbs: BreadcrumbState;
}

export type AppStore = Store;

export type StoreActions = BreadcrumbActions | RoutingActions;

const initState: AppStore = {
    breadcrumbs: {
        breadcrumbs: [],
        context: new BreadcrumbContext()
    },
    routing: {
        routingContext: new BaseRoutingContext()
    }
};

const appReducer = combineReducers<AppStore, StoreActions>({
    breadcrumbs: breadcrumbStateReducer,
    routing: routingStateReducer
});

const rootReducer = (state: AppStore, action: StoreActions) => {
    return appReducer(state, action);
};

export const store = createStore(
    rootReducer,
    initState,
    applyMiddleware(thunkMiddleware)
);

export default store;
