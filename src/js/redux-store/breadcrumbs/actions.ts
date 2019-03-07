import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { BreadcrumbInfo, BreadcrumbContextContract } from 'breadcrumbs';
import { AppStore } from 'redux-store';

export enum BreadcrumbActions {
    SET_CONTEXT = 'breadcrumb_set_context',
    SET_BREADCRUMBS = 'breadcrumb_set'
}

export function setBreadcrumbs(breadcrumbInfos:BreadcrumbInfo[]) {
    return (dispatch:ThunkDispatch<AppStore, void, AnyAction>) => {
        dispatch({
            type: BreadcrumbActions.SET_BREADCRUMBS,
            breadcrumbs: breadcrumbInfos
        });
    }
}

export function setBreadcrumbContext(context:BreadcrumbContextContract) {
    return {
        type: BreadcrumbActions.SET_CONTEXT,
        context: context
    };
}