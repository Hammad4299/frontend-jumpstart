delete process.env.TS_NODE_PROJECT
import dotenv from 'dotenv-defaults';
dotenv.config({
    defaults: '.env.defaults'
})
import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';
import webpack from 'webpack';
//import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
import path from 'path';
import webProjectConfig from './webpack-project';
import nodeProjectConfig from './webpack-project-node';
import Dotenv from 'dotenv-webpack';
import { baseOptions } from './webpack-common';
process.env.TS_NODE_PROJECT = path.resolve(__dirname,'./tsconfig.json');

const config = webpackMerge(
    commonConfig(webProjectConfig, {
        ...baseOptions.web,
        mode: 'watch',
        hmrNeeded: false,
        imagemin: false,
        cacheResults: false,
        enableCacheBusting: false,
        extractCss: false,
        minimizeCss: false,
        responsiveImages: false,
        shouldClean: false
    }), {
        mode: 'development',
        optimization: {
            splitChunks: false
        },
        target: 'web',
        // devtool: 'eval',
        // devtool: 'source-map',      //slowest and accurate. (seem to work with css)
        // devtool: 'eval-source-map',  //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
        devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
        plugins: [
            new Dotenv({
                defaults: true
            }) as any
        ]
    } as webpack.Configuration
);

const nodeConfig = webpackMerge(
    commonConfig(nodeProjectConfig, {
        ...baseOptions.node,
        mode: 'watch',
        hmrNeeded: false,
        imagemin: false,
        cacheResults: false,
        enableCacheBusting: false,
        extractCss: false,
        minimizeCss: false,
        responsiveImages: false,
        shouldClean: false
    }), {
        mode: 'development',
        target: 'node',
        // devtool: 'eval',
        // devtool: 'source-map',      //slowest and accurate. (seem to work with css)
        // devtool: 'eval-source-map',  //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
        devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
        plugins: [
            new webpack.BannerPlugin({
                banner: 'require("source-map-support").install();',      //stacktrace sourcemaps for nodejs
                raw: true, 
                entryOnly: false
            })
        ]
    } as webpack.Configuration
);

//const smp = new SpeedMeasurePlugin();
// export default smp.wrap(config);
export default [config, nodeConfig];