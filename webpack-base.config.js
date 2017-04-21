var path = require('path');
var webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].min.css",
    disable: false
});
//https://webpack.js.org/plugins/commons-chunk-plugin/
//http://stackoverflow.com/questions/39548175/can-someone-explain-webpacks-commonschunkplugin

module.exports = function () {
    return {
        devtool: 'source-map',  //For debugging purposes
        entry: {
            'bundle': './src/js/entrypoints/index.js',
            'bundle2': './src/js/entrypoints/index2.js',
            'vendor': ['./src/js/vendor/vendor1.js','./src/js/vendor/vendor2.js','./src/js/vendor/vendor3.js'],
            'css': './src/js/entrypoints/css.js'
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: '[name].js',
            publicPath: '/dist/'
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: "css",                                        //If same as entry name, it will overrite entry content
                chunks: ['css'],                                    //Can omit it if wants to find common from all (entry and other common chunks before this chunk)
                minChunks: 2
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "commons",                                  //They shouldn't contain any common thing from "vendor" because its already in vendor common chunks//Can omit it if wants to find common from all (entry and other common chunks before this chunk),
                minChunks: 2,
                chunks: ['bundle','bundle2']                       //Important, don't include vendor here. If you put it here, then any common code between vendor chunkk and other will be moved from vendor chunk to "common" and then following vendor chunk will be left without that
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                minChunks: Infinity                                 //Don't put anything else except whats already in entry point. It move any common code which was already part of vendor in vendor chunk and remove it from other chunks
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "manifest"
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            extractSass    //Separate css
        ],
        module: {
            rules: [
                {
                    test: /\.[s]*css$/,
                    use: extractSass.extract({
                        use: [{
                            loader: "css-loader"
                        }, {
                            loader: "sass-loader"
                        }],
                        // use style-loader in development
                        fallback: "style-loader"
                    })
                },
                {
                    test: /\.js[x]*$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                }
            ]
        }
    };
}