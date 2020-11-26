import webpack from "webpack";

export interface FaviconSetting {
    logo: string;
}

export type AssetsType =
    | "js"
    | "style"
    | "font"
    | "image"
    | "favicon"
    | "image-imagemin"
    | "html";

export interface ProjectSettings {
    root: string;
    entry: webpack.Configuration["entry"];
    alias: webpack.Configuration["resolve"]["alias"];
    externals?: webpack.Configuration["externals"];
    toClean: string[];
    toCopy: CopySetting[];
    src: string;
    contentOutput: string;
    favicon?: FaviconSetting;
    buildOutputName?(type: AssetsType, enableCacheBusting: boolean): string;
}

export interface ProjectBuildOptions {
    readonly extractCss?: boolean;
    readonly responsiveImages?: boolean;
    readonly lint?: boolean;
    readonly shouldClean?: boolean;
    readonly enableCacheBusting?: boolean;
    readonly cacheResults?: boolean;
    readonly shouldGenerateSourceMaps?: boolean;
    readonly imagemin?: false;
    readonly hmrNeeded?: boolean;
    readonly minimizeCss?: boolean;
    // readonly imageminOptions?: any;
    // readonly imageminWebpOptions?: any;
}

export interface CopySetting {
    to: string;
    from: string;
}
