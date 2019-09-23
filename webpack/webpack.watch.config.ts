delete process.env.TS_NODE_PROJECT
import dotenv from "dotenv-defaults"
dotenv.config({
    defaults: ".env.defaults",
})
import webpackMerge from "webpack-merge"
import commonConfig from "./webpack.config"
import webpack from "webpack"
import path from "path"
import webProjectConfig from "./webpack-project"
import nodeProjectConfig from "./webpack-project-node"
import { baseOptions } from "./webpack-common"
process.env.TS_NODE_PROJECT = path.resolve(__dirname, "../tsconfig.json")

const config = webpackMerge(
    commonConfig(webProjectConfig, {
        ...baseOptions.web,
        mode: "watch",
        hmrNeeded: false,
        imagemin: false,
        cacheResults: false,
        enableCacheBusting: false,
        extractCss: false,
        minimizeCss: false,
        responsiveImages: false,
        shouldClean: true, //Better to keep it on. Would prevent issues where some gzipped file gets served instead of actual one
    }),
    {
        mode: "development",
        name: webProjectConfig.name,
        optimization: {
            splitChunks: false,
        },
        target: "web",
        // devtool: 'eval',
        // devtool: 'source-map',      //slowest and accurate. (seem to work with css)
        devtool: "eval-source-map", //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
        // devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
        plugins: [],
    } as webpack.Configuration
)

const nodeConfig = webpackMerge(
    commonConfig(nodeProjectConfig, {
        ...baseOptions.node,
        mode: "watch",
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
        target: "node",
        name: nodeProjectConfig.name,
        node: {
            __dirname: false
        },
        devtool: "source-map",
        plugins: [
            new webpack.BannerPlugin({
                banner: 'require("source-map-support").install();', //stacktrace sourcemaps for nodejs
                raw: true,
                entryOnly: false,
            }),
        ],
    } as webpack.Configuration
)

export default [config, nodeConfig]
