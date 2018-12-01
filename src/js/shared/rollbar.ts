/**
 * Created by talha on 4/30/2018.
 */
import SiteConfig from 'externals/SiteConfig';
import rollbar from 'rollbar';

const _rollbarConfig:rollbar.Configuration = {
    accessToken: SiteConfig.rollbarToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    captureIp: 'anonymize',
    //SourceMaps
    payload: {
        environment: SiteConfig.environmment,
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
    transform: function(payload) {
        var trace = payload.body.trace;
        // Change 'yourdomainhere' to your domain.
        var mainDomain = SiteConfig.publicDomain;
        mainDomain = mainDomain.replace('.','\\.');

        var locRegex = new RegExp(`^(https?):\\/\\/[a-zA-Z0-9._-]+${mainDomain}(.*)`);
        if (trace && trace.frames) {
            for (var i = 0; i < trace.frames.length; i++) {
                var filename = trace.frames[i].filename;
                if (filename) {
                    var m = filename.match(locRegex);
                    // Be sure that the minified_url when uploading includes 'dynamichost'
                    trace.frames[i].filename = m[1] + '://dynamichost' + m[2];
                }
            }
        }
    }
};

if(SiteConfig.environmment==='production') {
    rollbar.init(_rollbarConfig);
    
}
