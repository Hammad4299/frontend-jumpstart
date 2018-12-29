export interface RoutingContext {
    getContextIdentifier(): string
    buildUrl(url: string, params?: { [index: string]: string });
    getBaseUrl():string;
}