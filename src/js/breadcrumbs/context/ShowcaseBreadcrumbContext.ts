import { ShowcaseBreadcrumbContextContract, BaseBreadcrumbContext } from "breadcrumbs";
import { BaseRoutingContext } from "routing";

export class ShowcaseBreadcrumbContext extends BaseBreadcrumbContext implements ShowcaseBreadcrumbContextContract {
    constructor() {
        super(new BaseRoutingContext());
    }
}