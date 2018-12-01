interface SiteConfig {
    rollbarToken:string,
    environmment:string,
    baseUrl:string
    appname: string,
    publicDomain: string,
    code_version: string    //git hash
}

export default <SiteConfig>{};