import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';
import path from 'path';
import env from './webpack.env';
import webpack from 'webpack';

const baseConfig = commonConfig({
    hmrNeeded: true,
    buildOutputName: (name: string, hashedPart: string):string => {
        return name.replace('[chunkhash]','[hash]');
    }
});

const config = webpackMerge(baseConfig, {
    mode: 'development',
    devtool: 'source-map',      //slowest and accurate. (seem to work with css)
    //devtool: 'eval-source-map',  //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
    //devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
    devServer: {
        hotOnly: true,
        contentBase: path.resolve(env.contentOutput)
    }
});

config.plugins.push(new webpack.HotModuleReplacementPlugin());
export default config;
