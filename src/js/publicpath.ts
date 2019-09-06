import SiteConfig from "externals/SiteConfig"

/*eslint-disable*/
declare var __webpack_public_path__:any
/*eslint-enable*/
//TODO replace below with dynamic public base url for static content correct wokring
__webpack_public_path__ =
    SiteConfig.staticContentBaseUrl || process.env.STATIC_CONTENT_URL
export default ""
