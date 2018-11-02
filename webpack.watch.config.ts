import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';
import SpeedMeasurePlugin from "speed-measure-webpack-plugin";
import { watchConfigModifier } from './webpack-project';

const config = webpackMerge(commonConfig(watchConfigModifier), {
    mode: 'development',
    devtool: 'eval',
    // devtool: 'source-map',      //slowest and accurate. (seem to work with css)
    // devtool: 'eval-source-map',  //best for dev (doesn't seem to work with css for some reason). For debugging purposes. Not for production because files also contains sourcemaps in them
    //devtool: 'cheap-module-eval-source-map',  //debugging only per line (doesn't seem to work with css for some reason)
});
const smp = new SpeedMeasurePlugin();
// export default smp.wrap(config);
export default config;