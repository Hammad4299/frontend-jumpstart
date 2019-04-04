delete process.env.TS_NODE_PROJECT
import dotenv from 'dotenv-defaults';
dotenv.config({
    defaults: '.env.defaults'
})
import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';
import path from 'path';
import Dotenv from 'dotenv-webpack';
import webpack from 'webpack';
import webProjectConfig from "./webpack-project";
import nodeProjectConfig from "./webpack-project-node";
import { baseOptions } from "./webpack-common";
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
process.env.TS_NODE_PROJECT = path.resolve(__dirname,'./tsconfig.json');

const config = webpackMerge(
    commonConfig(webProjectConfig, {
        ...baseOptions.web,
        mode: 'devserver',
        hmrNeeded: true,
        imagemin: false,
        cacheResults: false,
        enableCacheBusting: false,
        extractCss: false,
        minimizeCss: false,
        responsiveImages: false,
        shouldClean: false
    }), 
    {
        optimization: {
            splitChunks: false
        },
        mode: 'development',
        // devtool: 'eval',      //slowest and accurate. (seem to work with css)
        //devtool: 'eval-source-map',  //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
        devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
        target: 'web',
        devServer: {
            proxy: {
                '/': 'http://localhost:8082'
            },
            hotOnly: true,
            contentBase: path.resolve(webProjectConfig.contentOutput)
        },
        plugins: [
            new Dotenv({
                defaults: true
            }) as any,
            new webpack.HotModuleReplacementPlugin()
        ]
    } as webpack.Configuration
);

const nodeConfig = webpackMerge(
    commonConfig(nodeProjectConfig, {
        ...baseOptions.web,
        mode: 'devserver',
        hmrNeeded: true,
        imagemin: false,
        cacheResults: false,
        enableCacheBusting: false,
        extractCss: false,
        minimizeCss: false,
        responsiveImages: false,
        shouldClean: false
    }), 
    {
        mode: 'development',
        // devtool: 'eval',      //slowest and accurate. (seem to work with css)
        //devtool: 'eval-source-map',  //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
        devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
        target: 'node',
        devServer: {
            proxy: {
                '/': 'http://localhost:8082'
            },
            hotOnly: true,
            contentBase: path.resolve(webProjectConfig.contentOutput)
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.BannerPlugin({
                banner: 'require("source-map-support").install();',      //stacktrace sourcemaps for nodejs
                raw: true, 
                entryOnly: false
            }),
        ]
    } as webpack.Configuration
);

const smp = new SpeedMeasurePlugin();
// export default smp.wrap(config);
export default [config, nodeConfig];