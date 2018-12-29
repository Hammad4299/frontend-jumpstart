import { BreadcrumbInfo } from 'breadcrumbs';
export type Dispatcher = (breadcrumbs:BreadcrumbInfo[])=>void;

export interface ShowcaseBreadcrumbContextContract {
    isReady():boolean;
    example:(additionalData:any, dispatcher?:Dispatcher)=>BreadcrumbInfo[];
}