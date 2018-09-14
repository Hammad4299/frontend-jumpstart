import {AssetsType, IBaseConfigOptions, IProjectSettings} from './webpack-utils';
import path from 'path';
//Settings specific to this project. Other things if need to be adjusted should be modified directly in config files
const src = path.resolve('./src');
const output = path.resolve('./dist');
//These can be overridden by environment specific configuration
export const configDefaults:IBaseConfigOptions = {
    shouldClean: true,  //Whether to clean output directories as specified in "projectConfig"
    favicon: null,
    minimizeCss: false,
    htmlPlugin: false,
    hmrNeeded: false,
    shouldGenerateSourceMaps: true,
    buildOutputName: (type:AssetsType)=>{
        switch(type) {
            case 'font':
                return 'fonts/[name].[hash].[ext]';
            case 'image-imagemin':
                return '/[path][name].hash-[hash].[ext]';   // "/" is very important otherwise it will skip first letter.
            case 'image':
                return 'images/loaded/[name].hash-[hash].[ext]';
            case 'favicon':
                return 'favicon-[hash]/';
            case 'style':
                return 'css/generated/[name].[chunkhash].css';
            case 'js':
                return 'js/generated/[name].[chunkhash].js';
            default:
                return '[name].[ext]';
        }
    }
};

const projectConfig:IProjectSettings = {
    entry: {
        index: path.join(src, 'index.ts'),
        page2: path.join(src, 'js/page2.js'),
    },
    
    src: src,
    contentOutput: output,
    toClean: [  //relative to "root"
        'dist'
    ],
    toCopy: [
        {from: path.join(src,'images'), to: path.join(output,'images')},
        {from: path.join(src,'fonts'), to: path.join(output,'fonts')},
    ],
    root:path.resolve('./'),
    splitChunks:{
        cacheGroups: {
            vendors: {
                name: 'vendor'
            },
            common: {
                name: 'common'
            }
        }
    }
};

export default projectConfig;