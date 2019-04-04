import webpack, { Entry, EntryFunc, ExternalsElement } from 'webpack';
import ImageminGifsicle from "imagemin-gifsicle";
import ImageminJpegtran from "imagemin-jpegtran";
import ImageminOptipng from "imagemin-optipng";
import ImageminSvgo from "imagemin-svgo";
import ImageminWebp from 'imagemin-webp';

const emptyStr = (str:string, notEmpty:boolean)=>notEmpty ?  str : '';

export interface FaviconSetting {
    logo:string
}

export type AssetsType = 'js'|'style'|'font'|'image'|'favicon'|'image-imagemin'|'html';

export interface Options {
    readonly mode?:'watch'|'devserver'|'production'
    readonly extractCss?:boolean
    readonly responsiveImages?:boolean
    readonly shouldClean?: boolean
    readonly enableCacheBusting?:boolean
    readonly cacheResults?:boolean
    readonly htmlPlugin?:boolean
    readonly shouldGenerateSourceMaps?: boolean
    readonly imagemin?: boolean
    readonly favicon?: FaviconSetting
    readonly hmrNeeded?: boolean
    readonly minimizeCss?: boolean
    readonly imageminOptions?: any
    readonly imageminWebpOptions?: any
    buildOutputName?(type:AssetsType): string
}

export interface CopySetting {
    to:string
    from:string
}

export interface ProjectSettings {
    root:string
    entry: string | string[] | Entry | EntryFunc
    externals?:ExternalsElement | ExternalsElement[]
    toClean:string[]
    alias:{ [index:string] : string }
    toCopy:CopySetting[]
    src:string
    contentOutput:string
    optimizations: webpack.Options.Optimization
}

export const baseOptions = {
    web: {
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
        },
        imageminOptions: {
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
        },
        imageminWebpOptions: {
            imageminOptions: {
                // Lossless optimization with custom option
                plugins: [
                    ImageminWebp({
                        loseless: true
                    })
                ]
            }
        }
    } as Options,
    node: {
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
        },
        imageminOptions: {
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
        },
        imageminWebpOptions: {
            imageminOptions: {
                // Lossless optimization with custom option
                plugins: [
                    ImageminWebp({
                        loseless: true
                    })
                ]
            }
        }
    } as Options
}