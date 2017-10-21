var path = require('path');
var webpack = require('webpack');
var urljoin = require('url-join');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({});

const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

let paths = require('./webpack-path-base.config')();

paths.toCopy = [
    {from: paths.images, to: paths.images},
    {from: paths.font, to: paths.font},
];

paths.toCopy.map(function (item) {
    item.from = path.join(paths.src,item.from);
    item.to = path.join(paths.contentOutput,item.to);
});

const extractSass = new ExtractTextPlugin({
    filename: "[name].min.css",
    disable: false
});

const extractHtml = new ExtractTextPlugin({
    filename: "html/[name].html",
    disable: false
});

//https://webpack.js.org/plugins/commons-chunk-plugin/
//http://stackoverflow.com/questions/39548175/can-someone-explain-webpacks-commonschunkplugin

module.exports = function () {
    return {
        devtool: 'source-map',  //For debugging purposes
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            plugins: [
                new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
            ]
        },
        entry: {
            'twig1': [path.join(paths.src,'js/entrypoints/twig-test.js')],
            'js/app-bundle1': path.join(paths.src,'js/entrypoints/index.js'),
            'js/app-bundle2': path.join(paths.src,'js/entrypoints/index2.js'),
            'js/dependencies-bundle': ['babel-polyfill','react'],
            'js/vendor-bundle': [path.join(paths.src,'js/vendor/vendor1.js'),path.join(paths.src,'js/vendor/vendor2.js'),path.join(paths.src,'js/vendor/vendor3.js')],
            'css/app-bundle': path.join(paths.src,'js/entrypoints/css.js')
        },
        output: {
            path: paths.contentOutput,
            filename: '[name].js',
            publicPath: paths.public
        },
        plugins: [
            assetsPluginInstance,
            new CopyWebpackPlugin(paths.toCopy),
            new webpack.optimize.CommonsChunkPlugin({
                name: "css/commons",                                                        //If same as entry name, it will overrite entry content
                chunks: ['css/app-bundle'],                                         //Can omit it if wants to find common from all (entry and other common chunks before this chunk)
                minChunks: 2
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "js/commons",                                                    //They shouldn't contain any common thing from "vendor" because its already in vendor common chunks//Can omit it if wants to find common from all (entry and other common chunks before this chunk),
                minChunks: 2,
                chunks: ['js/app-bundle1','js/app-bundle2']                         //Important, don't include vendor here. If you put it here, then any common code between vendor chunkk and other will be moved from vendor chunk to "common" and then following vendor chunk will be left without that
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: ["js/dependencies-bundle","js/vendor-bundle"],
                minChunks: Infinity                                 //Don't put anything else except whats already in entry point. It move any common code which was already part of vendor in vendor chunk and remove it from other chunks
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "js/manifest"
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            extractSass,    //Separate css
            extractHtml     //Html from templates
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
                    test: /\.twig|\.swig|\.ejs|\.pug$/,
                    use: extractHtml.extract({
                        use: [{
                            loader: "html-loader"
                        }, {
                            loader: "template-html-loader?raw=true"
                        }]
                    })
                },
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                {
                    test: /\.ts[x]*$/,
                    loader: "awesome-typescript-loader"
                },
                {
                    test: /\.js[x]*$/,
                    loader: "babel-loader"
                },
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test: /\.(png|jpg|svg|bmp|gif)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: urljoin(paths.images,'[name].[ext]'), //Storing it in images/[name].[ext]
                    }
                },
                {
                    test: /\.(ttf|woff|woff2|otf|eot)$/,
                    loader: 'file-loader',
                    options: {
                        name: urljoin(paths.font,'[name].[ext]'),
                    },
                },
            ]
        }
    };
}