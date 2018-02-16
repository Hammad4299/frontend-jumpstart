const webpackMerge = require('webpack-merge');
var webpack = require('webpack');
const commonConfig = require('./webpack-base.config.js');
const env = 'development';
let helpers = require('./webpack.config.helper');

module.exports = function() {
    const config = webpackMerge(commonConfig(env), {
        //devtool: 'eval-source-map',  //For debugging purposes. Not for production because files also contains sourcemaps in them
        devtool: 'cheap-module-eval-source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(env)
                }
            })
        ]
    });

    config.module.rules.push(helpers.jsJSXWithBabelWithoutThreadLoader(config));
    config.module.rules.push(helpers.tsWithATLRule(config));
    return config;
};