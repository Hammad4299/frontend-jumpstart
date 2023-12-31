import { RoutingContext } from "../";

export class BaseRoutingContext implements RoutingContext {
    getContextIdentifier(): string {
        return "base-context";
    }

    buildUrl(url: string, params: { [index: string]: string } = {}) {
        return Object.keys(params).reduce((url: string, param: string) => {
            return url.replace(param, params[param]);
        }, this.getBaseUrl() + url);
    }

    getBaseUrl() {
        return "";
    }
}
