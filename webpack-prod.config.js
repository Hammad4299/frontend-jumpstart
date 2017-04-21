const webpackMerge = require('webpack-merge');
var webpack = require('webpack');
const commonConfig = require('./webpack-base.config.js');
let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function() {
    return webpackMerge(commonConfig(), {
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.min.css$/,
                cssProcessorOptions: { discardComments: { removeAll: true } }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    screw_ie8: true
                },
                comments: false
            })
        ]
    })
}