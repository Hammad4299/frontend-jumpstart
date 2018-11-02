import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';
import path from 'path';
import webpack from 'webpack';
import projectConfig, { devserverConfigModifier } from "./webpack-project";
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";

const baseConfig = commonConfig(devserverConfigModifier);

const config = webpackMerge(baseConfig, {
    mode: 'development',
    devtool: 'eval',      //slowest and accurate. (seem to work with css)
    //devtool: 'eval-source-map',  //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
    //devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
    devServer: {
        proxy: {
            '/': 'http://localhost:8082'
        },
        hotOnly: true,
        contentBase: path.resolve(projectConfig.contentOutput)
    }
});

config.plugins.push(new webpack.HotModuleReplacementPlugin());

const smp = new SpeedMeasurePlugin();

// export default smp.wrap(config);
export default config;
