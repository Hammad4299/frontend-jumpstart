import { BreadcrumbContextContract, BaseBreadcrumbContext } from "breadcrumbs";
import { BaseRoutingContext } from "routing";
export class BreadcrumbContext extends BaseBreadcrumbContext implements BreadcrumbContextContract {
    constructor() {
        super(new BaseRoutingContext());
    }
}