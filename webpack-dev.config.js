const webpackMerge = require('webpack-merge');
var webpack = require('webpack');
const commonConfig = require('./webpack-base.config.js');
let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function() {
    return webpackMerge(commonConfig(), {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('development')
                }
            })
        ]
    })
}