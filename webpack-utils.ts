import webpack, { Entry, EntryFunc, ExternalsElement } from 'webpack';
import SplitChunksOptions = webpack.Options.SplitChunksOptions;

export interface FaviconSetting {
    logo:string
}

export type AssetsType = 'js'|'style'|'font'|'image'|'favicon'|'image-imagemin';

export interface IBaseConfigOptions {
    readonly mode?:'watch'|'dev'|'production'
    readonly splitChucks?:boolean
    readonly extractCss?:boolean
    readonly responsiveImages?:boolean
    readonly shouldClean?: boolean;
    readonly enableCacheBusting?:boolean;
    readonly cacheResults?:boolean;
    readonly htmlPlugin?:boolean;
    readonly shouldGenerateSourceMaps?: boolean;
    readonly favicon?: FaviconSetting;
    readonly hmrNeeded?: boolean;
    readonly minimizeCss?: boolean;
    buildOutputName?(type:AssetsType): string;
}

export function constructConfigOptions(options:IBaseConfigOptions){
    return options;
}

export interface ICopySetting {
    to:string,
    from:string
}

export interface IProjectSettings {
    root:string,
    entry: string | string[] | Entry | EntryFunc,
    externals?:ExternalsElement | ExternalsElement[]
    toClean:string[],
    toCopy:ICopySetting[],
    src:string,
    contentOutput:string,
    splitChunks:SplitChunksOptions
}