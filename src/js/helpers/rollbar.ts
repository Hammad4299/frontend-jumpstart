/**
 * Created by talha on 4/30/2018.
 */
import SiteConfig from "externals/SiteConfig";
import rollbar from "rollbar";

const _rollbarConfig: rollbar.Configuration = {
    accessToken: SiteConfig.rollbarClientToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    captureIp: "anonymize",
    //SourceMaps
    payload: {
        environment: SiteConfig.environment,
        client: {
            javascript: {
                source_map_enabled: true, //this is now true by default
                code_version: SiteConfig.code_version,
                // Optionally have Rollbar guess which frames the error was thrown from
                // when the browser does not provide line and column numbers.
                guess_uncaught_frames: true
            }
        }
    },
    transform: function(payload: any) {
        const trace = payload.body.trace;
        // Change to domain name from where static js for which sourcemaps are configured is servered. It doesn't have to be subdomain but rather root domain. e.g. teraception.com or cdn.com as per following regex
        let mainDomain = SiteConfig.rollbarPublicDomain;
        mainDomain = mainDomain.replace(".", "\\.");

        const locRegex = new RegExp(
            `^(https?):\\/\\/[a-zA-Z0-9._-]*${mainDomain}(.*)`
        );

        if (trace && trace.frames) {
            for (let i = 0; i < trace.frames.length; i++) {
                const filename = trace.frames[i].filename;
                if (filename) {
                    const m = filename.match(locRegex);
                    if (m !== null && m.length >= 3) {
                        // Be sure that the minified_url when uploading includes 'dynamichost'
                        //replace whole domain portion with dynamichost. Keep rest same
                        trace.frames[i].filename =
                            m[1] + "://dynamichost" + m[2];
                    }
                }
            }
        }
    }
};

if (SiteConfig.environment === "production") {
    rollbar.init(_rollbarConfig);
}
