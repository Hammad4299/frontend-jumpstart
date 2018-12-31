import { combineReducers, AnyAction, applyMiddleware, createStore } from "redux";
import { routingStateReducer, breadcrumbStateReducer, RoutingState, BreadcrumbState } from "redux-store";
import { BreadcrumbContext } from "breadcrumbs";
import { BaseRoutingContext } from "routing";
import thunkMiddleware from 'redux-thunk';

interface Store {
    routing: RoutingState
    breadcrumbs: BreadcrumbState
}

export type AppStore = Store;

const initState:AppStore = {
    breadcrumbs: {
        breadcrumbs: [],
        context: new BreadcrumbContext()
    },
    routing: {
        routingContext: new BaseRoutingContext()
    }
};

const rootReducer = (state:AppStore,action:AnyAction)=>{
    return appReducer(state,action);
}

const appReducer = combineReducers<AppStore,AnyAction>({
    breadcrumbs: breadcrumbStateReducer,
    routing: routingStateReducer
});

export const store = createStore(rootReducer,  initState, applyMiddleware(thunkMiddleware));

export default store;