import { AssetsType, ProjectBuildOptions, ProjectSettings } from "../Types";
import { emptyStr } from "../Utils";
import commonConfig from "../webpack-base-config";
import CompressionPlugin from "compression-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MomentLocalesPlugin from "moment-locales-webpack-plugin";
import ObsoleteWebpackPlugin from "obsolete-webpack-plugin";
import path from "path";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import webpackMerge from "webpack-merge";

const src = path.resolve(__dirname, "../../src");
const output = path.resolve(__dirname, "../../dist");
process.env.TS_NODE_PROJECT = path.resolve(__dirname, "../../tsconfig.json");
export const projectConfig: ProjectSettings = {
    tsconfigPath: path.resolve(__dirname, "../tsconfig.json"),
    entry: {
        index: path.join(src, "js/index.ts"),
    },
    favicon: null,
    externals: {
        "externals/CSRFToken": "csrftoken", //now import xyz from 'myExternal' should work
        "externals/SiteConfig": "siteConfig",
    },
    src: src,
    alias: {
        images: path.join(src, "images"),
        styles: path.join(src, "styles"),
        fonts: path.join(src, "fonts"),
        "webp-images": path.join(src, "webp-images"),
    },
    contentOutput: output,
    toClean: ["**/*"],
    toCopy: [
        { from: path.join(src, "images"), to: path.join(output, "images") },
        {
            from: path.join(src, "webp-images"),
            to: path.join(output, "webp-images"),
        },
        { from: path.join(src, "fonts"), to: path.join(output, "fonts") },
    ],
    root: path.resolve(src, "../"),
    buildOutputName: function (
        type: AssetsType,
        enableCacheBusting: boolean,
    ): string {
        let toRet = "";

        switch (type) {
            case "font":
                toRet = `[path][name]${emptyStr(
                    ".[contenthash]",
                    enableCacheBusting,
                )}.[ext]`;
                break;
            case "image-imagemin":
                toRet = `[path][name]${emptyStr(
                    ".hash-[contenthash]",
                    enableCacheBusting,
                )}.[ext]`; // "/" is very important otherwise it will skip first letter (on windows).
                break;
            case "image":
                toRet = `[path]loaded/[name]${emptyStr(
                    ".hash-[contenthash]",
                    enableCacheBusting,
                )}.[ext]`;
                break;
            case "favicon":
                toRet = `favicon${emptyStr(
                    "-[contenthash]",
                    enableCacheBusting,
                )}/`;
                break;
            case "style":
                toRet = `css/generated/[name]${emptyStr(
                    ".[chunkhash]",
                    enableCacheBusting,
                )}.css`;
                break;
            case "html":
                toRet = `html/generated/[name]${emptyStr(
                    ".[chunkhash]",
                    enableCacheBusting,
                )}.html`;
                break;
            case "js":
                toRet = `js/generated/[name]${emptyStr(
                    ".[chunkhash]",
                    enableCacheBusting,
                )}.js`;

                break;
            default:
                toRet = `[name].[ext]`;
        }
        return toRet;
    },
};

// const imageMinOptions: Partial<ProjectBuildOptions> = {
//     imageminOptions: {
//         imageminOptions: {
//             // Lossless optimization with custom option
//             plugins: [
//                 [
//                     "gifsicle",
//                     {
//                         interlaced: true
//                     }
//                 ],
//                 [
//                     "jpegtran",
//                     {
//                         progressive: true
//                     }
//                 ],
//                 [
//                     "optipng",
//                     {
//                         optimizationLevel: 1
//                     }
//                 ],
//                 [
//                     "svgo",
//                     {
//                         removeViewBox: true
//                     }
//                 ]
//             ]
//         }
//     },
//     imageminWebpOptions: {
//         imageminOptions: {
//             // Lossless optimization with custom option
//             plugins: [
//                 [
//                     "webp",
//                     {
//                         loseless: true
//                     }
//                 ]
//             ]
//         }
//     }
// };

export const webDevConfig = webpackMerge(
    commonConfig(projectConfig, {
        // ...imageMinOptions,
        lint: false,
        shouldGenerateSourceMaps: true,
        hmrNeeded: true,
        imagemin: false,
        cacheResults: false,
        enableCacheBusting: true,
        extractCss: false,
        minimizeCss: false,
        responsiveImages: false,
        shouldClean: true,
    }),
    {
        mode: "development",
        // devtool: 'eval',      //slowest and accurate. (seem to work with css)
        devtool: "eval-source-map", //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
        // devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
        //https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710084554
        target: "browserslist",
        name: "web-dev",
        devServer: {
            // proxy: {
            //     '/': process.env.DEV_SERVER_PROXY
            // },
            client: {
                overlay: {
                    warnings: false,
                    errors: true,
                },
            },
            devMiddleware: {
                writeToDisk: true,
            },
            hot: true,
            // inline: true,
            port: parseInt(process.env.DEV_SERVER_PORT) || undefined,
            host: process.env.DEV_SERVER_HOST || "0.0.0.0",
            // hotOnly: true,
            static: {
                publicPath: "/",
                directory: path.resolve(projectConfig.contentOutput),
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),
            new ObsoleteWebpackPlugin(),
            new MomentLocalesPlugin(),
        ],
    } as webpack.Configuration,
);

console.log("asdsa", webDevConfig);

export const webProductionConfig = webpackMerge(
    commonConfig(projectConfig, {
        // ...imageMinOptions,
        lint: false,
        shouldGenerateSourceMaps: true,
        hmrNeeded: false,
        imagemin: false,
        cacheResults: false,
        enableCacheBusting: true,
        extractCss: true,
        minimizeCss: true,
        responsiveImages: true,
        shouldClean: true,
    }),
    {
        mode: "production",
        devtool: "nosources-source-map", //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
        target: "browserslist",
        name: "web-production",

        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),
            new ObsoleteWebpackPlugin(),
            new MomentLocalesPlugin(),
            new CompressionPlugin({
                threshold: 0,
                test: /\.(js|css|ttf|otf|eot)/,
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
            }),
        ],
    } as webpack.Configuration,
);
