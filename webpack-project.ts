import {AssetsType, IBaseConfigOptions, IProjectSettings} from './webpack-utils';
import path from 'path';
import env from "./webpack.env";
//Settings specific to this project. Other things if need to be adjusted should be modified directly in config files
const src = path.resolve('./src');
const output = path.resolve('./dist');
const emptyStr = (str:string, notEmpty:boolean)=>notEmpty ?  str : '';
//These can be overridden by environment specific configuration
export const configDefaults:IBaseConfigOptions = {
    shouldClean: true,  //Whether to clean output directories as specified in "projectConfig"
    favicon: null,
    minimizeCss: false,
    cacheResults: true,
    enableCacheBusting: true,
    htmlPlugin: false,
    hmrNeeded: false,
    shouldGenerateSourceMaps: true,
    buildOutputName: function(type:AssetsType):string {
        let toRet = '';
        const enableCacheBusting:boolean = this.enableCacheBusting;
        switch(type) {
            case 'font':
                toRet = `fonts/[name]${emptyStr('.[hash]',enableCacheBusting)}.[ext]`;
                break;
            case 'image-imagemin':
                toRet = `/[path][name]${emptyStr('.hash-[hash]',enableCacheBusting)}.[ext]`;   // "/" is very important otherwise it will skip first letter.
                break;
            case 'image':
                toRet = `images/loaded/[name]${emptyStr('.hash-[hash]', enableCacheBusting)}.[ext]`;
                break;
            case 'favicon':
                toRet = `favicon${emptyStr('-[hash]', enableCacheBusting)}/`;
                break;
            case 'style':
                toRet = `css/generated/[name]${emptyStr('.[chunkhash]', enableCacheBusting)}.css`;
                break;
            case 'js':
                toRet = `js/generated/[name]${emptyStr('.[chunkhash]', enableCacheBusting)}.js`;
                break;
            default:
                toRet = `[name].[ext]`;
        }
        return toRet;
    }
};

const projectConfig:IProjectSettings = {
    entry: {
        index: path.join(src, 'index.ts'),
        page2: path.join(src, 'js/page2.js'),
    },
    externals: {
        window: 'window',
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