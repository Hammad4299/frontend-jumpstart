
import { AnyAction } from 'redux';
import { BreadcrumbState } from './types';
import { BreadcrumbActions } from './actions';

export function breadcrumbStateReducer(previous:BreadcrumbState, action: AnyAction):BreadcrumbState {
    previous = previous || {
        context: null,
        breadcrumbs:  []
    };

    if(action.type === BreadcrumbActions.SET_BREADCRUMBS) {
        previous = {
            ...previous,
            breadcrumbs: action.breadcrumbs
        };
    } else if(action.type === BreadcrumbActions.SET_CONTEXT) {
        previous = {
            ...previous,
            context: action.context
        };
    }

    return previous;
}