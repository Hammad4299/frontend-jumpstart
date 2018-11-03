import {AssetsType, IBaseConfigOptions, IProjectSettings} from './webpack-utils';
import webpack from 'webpack';
import SplitChunksOptions = webpack.Options.SplitChunksOptions;
import path from 'path';
import env from "./webpack.env";
//Settings specific to this project. Other things if need to be adjusted should be modified directly in config files
const src = path.resolve('./src');
const output = path.resolve('./dist');

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
    splitChunks: <SplitChunksOptions>{
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
};

export default projectConfig;



const emptyStr = (str:string, notEmpty:boolean)=>notEmpty ?  str : '';

//These can be overridden by environment specific configuration
const configDefaults:IBaseConfigOptions = {
    favicon: null,
    htmlPlugin: false,
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

export const watchConfigModifier:IBaseConfigOptions = {
    ...configDefaults,
    mode:'watch',
    hmrNeeded: false,
    cacheResults: false,
    enableCacheBusting: false,
    extractCss: false,
    minimizeCss: false,
    responsiveImages: false,
    shouldClean: false,
    splitChucks: false  
};

export const devserverConfigModifier:IBaseConfigOptions = {
    ...watchConfigModifier,
    mode:'dev',
    hmrNeeded: true
};

export const prodConfigModifier:IBaseConfigOptions = {
    ...configDefaults,
    mode:'production',
    hmrNeeded: false,
    cacheResults: false,        //don't cache production, run from scratch
    enableCacheBusting: true,
    extractCss: true,
    minimizeCss: true,
    responsiveImages: true,
    shouldClean: true,
    shouldGenerateSourceMaps: true,
    splitChucks: true
};