import { BreadcrumbState, BreadcrumbActions } from "./types"

export function breadcrumbStateReducer(
    previous: BreadcrumbState,
    action: BreadcrumbActions
): BreadcrumbState {
    previous = previous || {
        context: null,
        breadcrumbs: [],
    }

    switch (action.type) {
        case "breadcrumb_set_context":
            previous = {
                ...previous,
                context: action.context,
            }
            break
        case "breadcrumbs_set":
            previous = {
                ...previous,
                breadcrumbs: action.breadcrumbs,
            }
            break
    }

    return previous
}
