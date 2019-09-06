import { BreadcrumbInfo, BreadcrumbContextContract } from "breadcrumbs"
import { SetBreadcrumbContextAction, SetBreadcrumbsAction } from "./types"

export function setBreadcrumbs(
    breadcrumbInfos: BreadcrumbInfo[]
): SetBreadcrumbsAction {
    return {
        type: "breadcrumbs_set",
        breadcrumbs: breadcrumbInfos,
    }
}

export function setBreadcrumbContext(
    context: BreadcrumbContextContract
): SetBreadcrumbContextAction {
    return {
        type: "breadcrumb_set_context",
        context: context,
    }
}
