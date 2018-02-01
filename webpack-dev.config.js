const webpackMerge = require('webpack-merge');
var webpack = require('webpack');
const commonConfig = require('./webpack-base.config.js');

module.exports = function() {
    return webpackMerge(commonConfig(), {
        devtool: 'eval-source-map',  //For debugging purposes. Not for production because files also contains sourcemaps in them
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('development')
                }
            })
        ]
    })
}