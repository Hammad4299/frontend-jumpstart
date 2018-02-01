const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack-base.config.js');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function() {
    return webpackMerge(commonConfig(), {
        //devtool: 'source-map',            //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
        devtool: 'nosources-source-map',  //Production ready separate sourcemap files with no original source code. SourceMaps Can be deployed securely
        plugins: [
            new webpack.LoaderOptionsPlugin({   //can pass shared options to all loaders
                //passing debug: false, or minimize: true here can cause css minification even without OptimizeCssAssetsPlugin. In that case, it will be handled by css-loader
            }),
            new OptimizeCssAssetsPlugin({
                //uses processor cssnano by default
                assetNameRegExp: /\.css$/,
                cssProcessorOptions: { zindex:false, discardComments: { removeAll: true } }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            })
        ]
    })
}