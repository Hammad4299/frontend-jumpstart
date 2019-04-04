import { ProjectSettings } from './webpack-common';
import path from 'path';

//Settings specific to this project. Other things if need to be adjusted should be modified directly in config files
const src = path.resolve(__dirname,'../src');
const output = path.resolve(__dirname,'../dist');

export const projectConfig:ProjectSettings = {
    entry: {
        index: path.join(src, 'js/index.ts')
    },
    externals: {
        'externals/CSRFToken': 'csrftoken', //now import xyz from 'myExternal' should work
		'externals/RemoteRoutes': 'routes',
		'externals/SiteConfig': 'siteConfig',
    },
    src: src,
    alias: {
        'images': path.join(src,'images'),
        'styles': path.join(src,'styles'),
        'fonts': path.join(src,'fonts'),
        'webp-images': path.join(src,'webp-images'),
    },
    contentOutput: output,
    toClean: [  //relative to "root"
        'dist'
    ],
    toCopy: [
        {from: path.join(src,'images'), to: path.join(output,'images')},
        {from: path.join(src,'webp-images'), to: path.join(output,'webp-images')},
        {from: path.join(src,'fonts'), to: path.join(output,'fonts')},
    ],
    root: path.resolve('../'),
    optimizations: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: "all",
            automaticNameDelimiter: '-',
            cacheGroups: {
                default: false,
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: 'vendor'
                },
                common: {   //default config used by "default" cache group, just renamed it to "common:
                    name: 'common',
                    minChunks: 2,
                    priority: -10,
                    reuseExistingChunk: true
                }
            }
        }
    }
};

export default projectConfig;