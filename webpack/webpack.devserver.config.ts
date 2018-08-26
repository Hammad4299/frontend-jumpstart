import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';
import path from 'path';
import webpack from 'webpack';
import projectConfig, {configDefaults} from "./webpack-project";
import {AssetsType} from "./webpack-utils";

const baseConfig = commonConfig({
    hmrNeeded: true,
    buildOutputName: (type:AssetsType)=>{
        return configDefaults.buildOutputName(type).replace('[chunkhash]','[hash]').replace('[contenthash]','[hash]');
    }
});

const config = webpackMerge(baseConfig, {
    mode: 'development',
    devtool: 'source-map',      //slowest and accurate. (seem to work with css)
    //devtool: 'eval-source-map',  //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
    //devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
    devServer: {
        hotOnly: true,
        contentBase: path.resolve(projectConfig.contentOutput)
    }
});

config.plugins.push(new webpack.HotModuleReplacementPlugin());
export default config;
