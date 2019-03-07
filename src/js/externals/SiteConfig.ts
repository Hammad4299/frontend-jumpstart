interface SiteConfig {
    rollbarClientToken:string,
    environment:string,
    baseUrl:string
    appname: string,
    rollbarPublicDomain: string,
    code_version: string    //git hash
}

export default <SiteConfig>{};