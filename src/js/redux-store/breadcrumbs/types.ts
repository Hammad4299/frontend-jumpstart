import { ShowcaseBreadcrumbContext, BreadcrumbInfo } from 'breadcrumbs';

export interface BreadcrumbState {
    context:ShowcaseBreadcrumbContext
    breadcrumbs: BreadcrumbInfo[]
}