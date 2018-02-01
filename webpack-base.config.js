const path = require('path');
const webpack = require('webpack');
const urljoin = require('url-join');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AssetsPlugin = require('assets-webpack-plugin');
const assetsPluginInstance = new AssetsPlugin({});
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
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

const extractCss = new ExtractTextPlugin({
    filename: "css/[name].min.css",
    disable: false,
    allChunks: true
});

const extractHtml = new ExtractTextPlugin({
    filename: "html/[name].html",
    disable: false,
    allChunks: true
});

// the path(s) that should be cleaned
let pathsToClean = [
	'dist'
];

// the clean options to use
let cleanOptions = {
    root:     __dirname,
    exclude:  [],
    verbose:  true,
    dry:      false,
    watch: false		//It could cause issues, e.g. webpack only copies modified images via copy plugin, so we should clear images on watch
};

//https://webpack.js.org/plugins/commons-chunk-plugin/
//http://stackoverflow.com/questions/39548175/can-someone-explain-webpacks-commonschunkplugin

module.exports = function () {
    return {
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            plugins: [
                new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
            ]
        },
        entry: {
            'index': path.join(paths.src,'js/entrypoints/index.js'),
            'index2': path.join(paths.src,'js/entrypoints/index2.js'),
            'react-bundle': ['react-dom','react','redux','react-redux'],
            'vendor-bundle': [path.join(paths.src,'js/vendor/vendor1.js'),path.join(paths.src,'js/vendor/vendor2.js'),path.join(paths.src,'js/vendor/vendor3.js')]
        },
        output: {
            path: paths.contentOutput,
            filename: 'js/[name].js',
            publicPath: paths.public
        },
        plugins: [
            new CleanWebpackPlugin(pathsToClean, cleanOptions),
            new HardSourceWebpackPlugin(),  //For build cachings. Can cause issues. If so, try disabling it or deleting its cache folder. (default location node_modules/.cache)
            new webpack.optimize.ModuleConcatenationPlugin(),   //Causes bailouts if array specified as entrypoints
            extractCss,    //Separate css
            // new CSSSplitWebpackPlugin({
            // //     //Splitting also mess up AssetPlugin. Only use, if required
            //      size: 100, //For IE 9, it is 4095
            // //     //Make it true if you want to include single css file as before. This single file will have imports for other split files.
            // //     // Note, this would make additional request and could effect performance for browser which don't even require splitting.
            // //     // Better way to be to include preserved (non-splitted css) for browser which can work with them, and splitted css for browsers which don't
            //      imports: 'css/generated/[name]-split.css',
            //      preserve: true,
            //      filename: "css/generated/[name]-[part].[ext]"   //Might need to modify regex of OptimizeCssAssetsPlugin
            // }),
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
            extractHtml     //Html from templates
        ],
        module: {
            rules: [
                {
                    test: /\.[s]*css$/,
                    use: extractCss.extract({
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    importLoaders: 1,
                                    sourceMap: true
                                }
                            }, {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true
                                }
                            }
                        ],
                        // use style-loader in development
                        fallback: {
                            loader: "style-loader",
                            options: { sourceMap: true }
                        }
                    })
                },
                {
                    test: /\.less$/,
                    use: extractCss.extract({
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    importLoaders: 1,
                                    sourceMap: true
                                }
                            }, {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: "less-loader",
                                options: {
                                    sourceMap: true
                                }
                            }
                        ],
                        // use style-loader in development
                        fallback: {
                            loader: "style-loader",
                            options: { sourceMap: true }
                        }
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
        },
        stats: {
            // Examine all modules
            maxModules: Infinity,
            // Display bailout reasons
            optimizationBailout: true
        }
    };
}