import { BreadcrumbInfo } from "breadcrumbs"
export type Dispatcher = (breadcrumbs: BreadcrumbInfo[]) => void

export interface BreadcrumbContextContract {
    isReady(): boolean
    example: (additionalData: any, dispatcher?: Dispatcher) => BreadcrumbInfo[]
}
