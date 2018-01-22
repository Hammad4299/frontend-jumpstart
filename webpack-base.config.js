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
    filename: "css/[name].min.css",
    disable: false,
    allChunks: true
});

const extractHtml = new ExtractTextPlugin({
    filename: "html/[name].html",
    disable: false,
    allChunks: true
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
            'index': path.join(paths.src,'js/entrypoints/index.js'),
            'index2': path.join(paths.src,'js/entrypoints/index2.js'),
            'react-bundle': ['react-dom','react','redux','babel-polyfill','react-redux'],
            'vendor-bundle': [path.join(paths.src,'js/vendor/vendor1.js'),path.join(paths.src,'js/vendor/vendor2.js'),path.join(paths.src,'js/vendor/vendor3.js')]
        },
        output: {
            path: paths.contentOutput,
            filename: 'js/[name].js',
            publicPath: paths.public
        },
        plugins: [
            assetsPluginInstance,
            new CopyWebpackPlugin(paths.toCopy),
            new webpack.optimize.CommonsChunkPlugin({
                name: "commons",                                                        //If same as entry name, it will overrite entry content
                minChunks: 2,
                chunks: ["index","index2"]
            }),
            //For separate all 3rd party vendor from your code
            //Don't specify vendor entrypoint in your common chunks.
            //      Important, If you put it here, then any common code between vendor chunk and other will be moved from vendor chunk to "common" and then following vendor chunk will be left without that
            //Create separate common chunk for vendor with only entry points (in "name" property instead of chunks)for vendor ccntent. Set minChunks to "infinity".
            //      Don't put anything else except whats already in entry point. It move any common code which was already part of vendor in vendor chunk and remove it from other chunks
            new webpack.optimize.CommonsChunkPlugin({
                name: ["react-bundle","vendor-bundle"],
                minChunks: Infinity                                 //Don't put anything else except whats already in entry point. It move any common code which was already part of vendor in vendor chunk and remove it from other chunks
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "manifest"
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
                    test: /.pug/,
                    use: extractHtml.extract({
                        use: [{
                            loader: "html-loader"
                        }, {
                            loader: "pug-html-loader",
                            options: {
                                pretty: true
                            }
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
        },
        externals: {
            moment: 'moment',
            bootstrap: "bootstrap",
            flatpickr: "flatpickr",
            'moment-duration-format': 'moment-duration-format',
            jQuery: "jquery"
        }
    };
}