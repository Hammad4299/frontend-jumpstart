import { BreadcrumbContextContract, BreadcrumbInfo } from 'breadcrumbs';

export interface BreadcrumbState {
    context:BreadcrumbContextContract
    breadcrumbs: BreadcrumbInfo[]
}