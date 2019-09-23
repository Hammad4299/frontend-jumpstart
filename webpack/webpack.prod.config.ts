delete process.env.TS_NODE_PROJECT
import dotenv from "dotenv-defaults"
dotenv.config({
    defaults: ".env.defaults",
})
import path from "path"
import webpackMerge from "webpack-merge"
import commonConfig from "./webpack.config"
import TerserPlugin from "terser-webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import CompressionPlugin from "compression-webpack-plugin"
import webProjectConfig from "./webpack-project"
import webLibProjectConfig from "./webpack-project.lib"
import nodeProjectConfig from "./webpack-project-node"
import { baseOptions } from "./webpack-common"
import MomentLocalesPlugin from "moment-locales-webpack-plugin"
import webpack from "webpack"
process.env.TS_NODE_PROJECT = path.resolve(__dirname, "./tsconfig.json")

const config = webpackMerge(
    commonConfig(webProjectConfig, {
        ...baseOptions.web,
        hmrNeeded: false,
        cacheResults: false, //don't cache production, run from scratch
        enableCacheBusting: true,
        extractCss: true,
        lint: false,
        imagemin: true,
        minimizeCss: true,
        responsiveImages: true,
        shouldClean: true,
        shouldGenerateSourceMaps: true,
    }),
    {
        //devtool: 'source-map',            //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
        mode: "production",
        target: "web",
        name: webProjectConfig.name,
        devtool: "nosources-source-map", //Production ready separate sourcemap files with no original source code. SourceMaps Can be deployed securely
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true, // set to true if you want JS source maps
                }),
            ],
        },
        plugins: [
            new MomentLocalesPlugin(),
            new CompressionPlugin({
                threshold: 0,
                test: /\.(js|css|ttf|otf|eot)/,
            }),
            // new BundleAnalyzerPlugin({
            //     analyzerMode: "static",
            // }),
        ],
    } as webpack.Configuration
)

const nodeConfig = webpackMerge(
    commonConfig(nodeProjectConfig, {
        ...baseOptions.web,
        hmrNeeded: false,
        lint: true,
        cacheResults: false, //don't cache production, run from scratch
        enableCacheBusting: false,
        extractCss: true,
        imagemin: true,
        minimizeCss: true,
        responsiveImages: true,
        shouldClean: true,
        shouldGenerateSourceMaps: true,
    }),
    {
        devtool: "source-map", //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
        mode: "production",
        target: "node",
        name: nodeProjectConfig.name,
        node: {
            __dirname: false
        },
        // devtool: 'nosources-source-map',  //Production ready separate sourcemap files with no original source code. SourceMaps Can be deployed securely
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true, // set to true if you want JS source maps
                }),
            ],
        },
        plugins: [
            new MomentLocalesPlugin(),
            new CompressionPlugin({
                threshold: 0,
                test: /\.(js|css|ttf|otf|eot)/,
            }),
            // new BundleAnalyzerPlugin({
            //     analyzerMode: "static",
            // }),
            new webpack.BannerPlugin({
                banner: 'require("source-map-support").install();', //stacktrace sourcemaps for nodejs
                raw: true,
                entryOnly: false,
            }),
        ],
    } as webpack.Configuration
)

const libConfig = webpackMerge(
    commonConfig({
        ...webLibProjectConfig,
        contentOutput: path.join(webLibProjectConfig.contentOutput,'umd')
    }, {
        ...baseOptions.lib,
        hmrNeeded: false,
        cacheResults: false, //don't cache production, run from scratch
        enableCacheBusting: true,
        extractCss: true,
        lint: false,
        imagemin: true,
        minimizeCss: true,
        responsiveImages: true,
        shouldClean: true,
        shouldGenerateSourceMaps: true,
    }),
    {
        output: {
            libraryTarget: 'umd',
            library: 'mylib'
        },
        //devtool: 'source-map',            //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
        mode: "production",
        target: "web",
        name: webLibProjectConfig.name,
        devtool: "source-map", //Production ready separate sourcemap files with no original source code. SourceMaps Can be deployed securely
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true, // set to true if you want JS source maps
                }),
            ],
        },
        plugins: [
            new MomentLocalesPlugin(),
            new CompressionPlugin({
                threshold: 0,
                test: /\.(js|css|ttf|otf|eot)/,
            }),
            // new BundleAnalyzerPlugin({
            //     analyzerMode: "static",
            // }),
        ],
    } as webpack.Configuration
)


const libConfigEsm = webpackMerge(
    commonConfig({
        ...webLibProjectConfig,
        contentOutput: path.join(webLibProjectConfig.contentOutput,'lib-esm')
    }, {
        ...baseOptions.lib,
        hmrNeeded: false,
        cacheResults: false, //don't cache production, run from scratch
        enableCacheBusting: true,
        extractCss: true,
        lint: false,
        imagemin: true,
        minimizeCss: true,
        responsiveImages: true,
        shouldClean: true,
        shouldGenerateSourceMaps: true,
    }),
    {
        output: {
            libraryTarget: 'umd',
            library: 'mylib'
        },
        //devtool: 'source-map',            //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
        mode: "production",
        target: "web",
        name: `${webLibProjectConfig.name}.esm`,
        devtool: "source-map", //Production ready separate sourcemap files with no original source code. SourceMaps Can be deployed securely
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true, // set to true if you want JS source maps
                }),
            ],
        },
        plugins: [
            new MomentLocalesPlugin(),
            new CompressionPlugin({
                threshold: 0,
                test: /\.(js|css|ttf|otf|eot)/,
            }),
            // new BundleAnalyzerPlugin({
            //     analyzerMode: "static",
            // }),
        ],
    } as webpack.Configuration
)


export default [config, nodeConfig, libConfig, libConfigEsm]
