import { Routes } from "routing";
import { BreadcrumbType, BreadcrumbInfo } from "breadcrumbs";

export const breadcrumbCreator = {
    example: (routing: Routes): BreadcrumbInfo => {
        return {
            type: BreadcrumbType.SAMPLE_TYPE,
            route: routing.react.samplePage(),
            name: "Some name"
        };
    }
};
