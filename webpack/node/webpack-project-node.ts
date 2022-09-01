import { AssetsType, ProjectSettings } from "../Types";
import commonConfig from "../webpack-base-config";
import path from "path";
import webpack from "webpack";
import webpackMerge from "webpack-merge";
import nodeExternals from "webpack-node-externals";

const src = path.resolve(__dirname, "../../src");
const output = path.resolve(__dirname, "../../dist-node");

const projectConfig: ProjectSettings = {
    tsconfigPath: path.resolve(__dirname, "../tsconfig.json"),
    entry: {
        index: path.join(src, "js/index.ts"),
    },
    externals: [
        nodeExternals({
            allowlist: [
                "lodash-es",
                "formidable",
                "url-join",
                "normalize-url",
                "crypto-random-string",
                "parse-domain",
                "is-ip",
                "ip-regex",

                //node-fetch es module
                /^data-uri-to-buffer/,
                /^formdata-polyfill/,
                /^fetch-blob/,
                /^node-fetch/,
            ],
        }),
    ],
    favicon: null,
    src: src,
    alias: {
        images: path.join(src, "images"),
        styles: path.join(src, "styles"),
        fonts: path.join(src, "fonts"),
        "webp-images": path.join(src, "webp-images"),
    },
    contentOutput: output,
    toClean: [
        //relative to "root"
        "**/*",
    ],
    toCopy: [
        { from: path.join(src, "images"), to: path.join(output, "images") },
        {
            from: path.join(src, "webp-images"),
            to: path.join(output, "webp-images"),
        },
        { from: path.join(src, "fonts"), to: path.join(output, "fonts") },
    ],
    root: path.resolve(src, "../"),
    buildOutputName: function (type: AssetsType): string {
        let toRet = "";
        switch (type) {
            case "font":
                toRet = `[path][name].[ext]`;
                break;
            case "image-imagemin":
                toRet = `[path][name].[ext]`; // "/" is very important otherwise it will skip first letter (on windows).
                break;
            case "image":
                toRet = `[path]/[name].[ext]`;
                break;
            case "favicon":
                toRet = `favicon/`;
                break;
            case "style":
                toRet = `[name].css`;
                break;
            case "html":
                toRet = `[name].html`;
                break;
            case "js":
                toRet = `[name].js`;
                break;
            default:
                toRet = `[name].[ext]`;
        }
        return toRet;
    },
};

export const nodeDevConfig = webpackMerge(
    commonConfig(projectConfig, {
        lint: false,
        shouldGenerateSourceMaps: true,
        hmrNeeded: false,
        imagemin: false,
        cacheResults: false,
        enableCacheBusting: false,
        extractCss: false,
        minimizeCss: false,
        responsiveImages: false,
        shouldClean: false,
    }),
    {
        mode: "development",
        target: "node12",
        watch: true,
        name: "node-dev",
        externalsPresets: {
            node: true,
        },
        resolve: {
            fallback: {
                //needed for packages bundled in webpack e.g. in allowlist of webpack node external
                // path: require.resolve("path-browserify"),
            },
        },

        node: {
            __dirname: false,
        },
        optimization: {
            runtimeChunk: false,
            splitChunks: false,
        },
        devtool: "source-map",
        plugins: [
            new webpack.BannerPlugin({
                banner: 'require("source-map-support").install();', //stacktrace sourcemaps for nodejs
                raw: true,
                entryOnly: false,
            }),
        ],
    },
);

export const nodeProductionConfig = webpackMerge(
    commonConfig(projectConfig, {
        hmrNeeded: false,
        lint: false,
        cacheResults: false, //don't cache production, run from scratch
        enableCacheBusting: false,
        extractCss: false,
        imagemin: false,
        minimizeCss: false,
        responsiveImages: false,
        shouldClean: true,
        shouldGenerateSourceMaps: true,
    }),
    {
        devtool: "source-map", //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
        mode: "production",
        target: "node12",
        externalsPresets: {
            node: true,
        },
        resolve: {
            fallback: {
                //needed for packages bundled in webpack e.g. in allowlist of webpack node external
                // path: require.resolve("path-browserify"),
            },
        },
        optimization: {
            runtimeChunk: false,
            splitChunks: false,
        },
        name: "node-production",
        node: {
            __dirname: false,
        },
        plugins: [
            new webpack.BannerPlugin({
                banner: 'require("source-map-support").install();', //stacktrace sourcemaps for nodejs
                raw: true,
                entryOnly: false,
            }),
        ],
    } as webpack.Configuration,
);
