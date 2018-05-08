const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack-base.config.js');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const env = 'production';
const CompressionPlugin = require('compression-webpack-plugin');

let helpers = require('./webpack.config.helper');

module.exports = function() {
    const config = webpackMerge(commonConfig(env), {
        devtool: 'source-map',            //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
        //devtool: 'nosources-source-map',  //Production ready separate sourcemap files with no original source code. SourceMaps Can be deployed securely
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin(),   //Causes bailouts if array specified as entrypoints
            new webpack.LoaderOptionsPlugin({   //can pass shared options to all loaders
                debug: false,
                minimize: true //here can cause css minification even without OptimizeCssAssetsPlugin. In that case, it will be handled by css-loader
            }),
            // new OptimizeCssAssetsPlugin({        //seems like it messes sourcemap as of 02-21-2018
            //     //uses processor cssnano by default
            //     assetNameRegExp: /\.css$/,
            //     cssProcessorOptions: {
            //         zindex:false,
            //         safe: true,
            //         sourcemap: true,
            //         discardComments: { removeAll: true }
            //     }
            // }),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(env)
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            }),
            new CompressionPlugin({
                threshold: 0,
                test: /\.(js|css|ttf|otf|eot)/
            })
        ],
        stats: {
            // Examine all modules
            maxModules: Infinity,
            // Display bailout reasons
            optimizationBailout: true
        }
    });


    helpers.imageminPlugin(config,false); //must be at end
    return config;
}