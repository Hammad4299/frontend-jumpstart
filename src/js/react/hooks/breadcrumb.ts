import { useSelector, useDispatch } from "react-redux";
import { AppStore, SetBreadcrumbContextAction } from "redux-store";
import { Dispatch } from "redux";

export function useBreadcrumbContext() {
    const context = useSelector((store: AppStore) => store.breadcrumbs.context);
    const dispatch = useDispatch<Dispatch<SetBreadcrumbContextAction>>();
    return [context, dispatch];
}
