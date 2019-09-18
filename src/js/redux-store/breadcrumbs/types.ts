import { BreadcrumbContextContract, BreadcrumbInfo } from "breadcrumbs";

export interface BreadcrumbState {
    context: BreadcrumbContextContract;
    breadcrumbs: BreadcrumbInfo[];
}

export interface SetBreadcrumbContextAction {
    type: "breadcrumb_set_context";
    context: BreadcrumbContextContract;
}

export interface SetBreadcrumbsAction {
    type: "breadcrumbs_set";
    breadcrumbs: BreadcrumbInfo[];
}

export type BreadcrumbActions =
    | SetBreadcrumbsAction
    | SetBreadcrumbContextAction;
