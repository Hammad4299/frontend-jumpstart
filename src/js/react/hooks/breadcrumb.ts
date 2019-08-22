import { useSelector, useDispatch } from "react-redux";
import { AppStore, SetBreadcrumbContextAction } from "redux-store";
import { Dispatch } from "redux";

export function useBreadcrumbContext() {
    let context = useSelector((store:AppStore)=>store.breadcrumbs.context)
    let dispatch = useDispatch<Dispatch<SetBreadcrumbContextAction>>();
    return [context, dispatch];
}