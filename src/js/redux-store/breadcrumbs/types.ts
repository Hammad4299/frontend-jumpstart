import { BreadcrumbContext, BreadcrumbInfo } from 'breadcrumbs';

export interface BreadcrumbState {
    context:BreadcrumbContext
    breadcrumbs: BreadcrumbInfo[]
}