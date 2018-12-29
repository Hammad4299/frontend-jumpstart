export enum BreadcrumbType {
    SAMPLE_TYPE = 'sample_type'
}

export interface BreadcrumbInfo {
    name: string,
    route:string,
    type: BreadcrumbType
}