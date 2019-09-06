import { Dispatcher, breadcrumbCreator, BreadcrumbInfo } from "breadcrumbs"
import { Routes, routesForContext, RoutingContext } from "routing"

export abstract class BaseBreadcrumbContext {
    protected routes: Routes

    constructor(routingContext: RoutingContext) {
        this.routes = routesForContext(routingContext)
    }

    protected dispatchCrumbs(
        dispatcher: Dispatcher = null,
        crumbs: BreadcrumbInfo[]
    ): BreadcrumbInfo[] {
        if (dispatcher) {
            dispatcher(crumbs)
        }
        return crumbs
    }

    isReady(): boolean {
        return true
    }
    example(additionalData: any, dispatcher?: Dispatcher) {
        return this.dispatchCrumbs(dispatcher, [
            breadcrumbCreator.example(this.routes),
        ])
    }
}
