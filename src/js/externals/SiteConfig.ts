interface SiteConfig {
    rollbarClientToken: string;
    environment: string;
    baseUrl: string;
    staticContentBaseUrl: string;
    appname: string;
    rollbarPublicDomain: string;
    code_version: string; //git hash
}

export default {} as SiteConfig;
