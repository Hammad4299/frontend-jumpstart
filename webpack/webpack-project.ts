import {AssetsType, IBaseConfigOptions, IProjectSettings} from './webpack-utils';
import webpack from 'webpack';
import SplitChunksOptions = webpack.Options.SplitChunksOptions;
import path from 'path';
import ImageminGifsicle from "imagemin-gifsicle";
import ImageminJpegtran from "imagemin-jpegtran";
import ImageminOptipng from "imagemin-optipng";
import ImageminSvgo from "imagemin-svgo";
import ImageminWebp from 'imagemin-webp';
//Settings specific to this project. Other things if need to be adjusted should be modified directly in config files
const src = path.resolve(__dirname,'../src');
const output = path.resolve(__dirname,'../dist');

const projectConfig:IProjectSettings = {
    entry: {
        index: path.join(src, 'js/index.ts')
    },
    externals: {
        window: 'window',
        'externals/CSRFToken': 'csrftoken', //now import xyz from 'myExternal' should work
		'externals/RemoteRoutes': 'routes',
		'externals/SiteConfig': 'siteConfig',
    },
    src: src,
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
                toRet = `[path][name]${emptyStr('.[hash]',enableCacheBusting)}.[ext]`;
                break;
            case 'image-imagemin':
                toRet = `/[path][name]${emptyStr('.hash-[hash]',enableCacheBusting)}.[ext]`;   // "/" is very important otherwise it will skip first letter (on windows).
                break;
            case 'image':
                toRet = `[path]loaded/[name]${emptyStr('.hash-[hash]', enableCacheBusting)}.[ext]`;
                break;
            case 'favicon':
                toRet = `favicon${emptyStr('-[hash]', enableCacheBusting)}/`;
                break;
            case 'style':
                toRet = `css/generated/[name]${emptyStr('.[chunkhash]', enableCacheBusting)}.css`;
                break;
            case 'html':
                toRet = `html/generated/[name]${emptyStr('.[chunkhash]', enableCacheBusting)}.html`;
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
    imagemin: false,
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
    imagemin: true,
    minimizeCss: true,
    responsiveImages: true,
    shouldClean: true,
    shouldGenerateSourceMaps: true,
    splitChucks: true
};


export const imagminOptions = {
    imageminOptions: {
        // Lossless optimization with custom option
        plugins: [
            ImageminGifsicle({
                interlaced: true
            }),
            ImageminJpegtran({
                progressive: true
            }),
            ImageminOptipng({
                optimizationLevel: 1
            }),
            ImageminSvgo({
                removeViewBox: true
            })
        ]
    }
}

export const imagminWebpOptions = {
    imageminOptions: {
        // Lossless optimization with custom option
        plugins: [
            ImageminWebp({
                loseless: true
            })
        ]
    }
}