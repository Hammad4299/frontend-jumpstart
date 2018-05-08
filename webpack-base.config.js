module.exports = function (env) {
    const path = require('path');
    const webpack = require('webpack');
    const urljoin = require('url-join');
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    const AssetsPlugin = require('assets-webpack-plugin');
    const assetsPluginInstance = new AssetsPlugin({});
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
    const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
    let paths = require('./webpack-path-base.config')();
    let helpers = require('./webpack.config.helper');

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

    let configBase = {
        //https://webpack.js.org/configuration/resolve/
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx",".json"],
            modules: ['node_modules'],
            alias: {
                styles: path.join(paths.src,'styles'),    //Now, we can use 'css/myfile-inside-css-folder' from anywhere
                fonts: path.join(paths.src,'fonts'),
                images: path.join(paths.src,'images'),
                js: path.join(paths.src,'js'),
                views: path.join(paths.src,'views')
            },
            plugins: [
                new TsConfigPathsPlugin({ /*configFile: "./path/to/tsconfig.json" */ })
            ]
        },
        entry: {
            'index': 'js/entrypoints/index.js', //No need for absolution path due to resolve.alias
            'index2': 'js/entrypoints/index2.js',
            'overview': 'js/entrypoints/overview.js',
            'react-bundle': ['react-dom','react','redux','react-redux'],
            'vendor-bundle': [path.join(paths.src,'js/vendor/vendor1.js'),path.join(paths.src,'js/vendor/vendor2.js'),path.join(paths.src,'js/vendor/vendor3.js')]
        },
        output: {
            path: paths.contentOutput,
            filename: 'js/[name].min.js',
            publicPath: paths.public
        },
        plugins: [
            new CleanWebpackPlugin(pathsToClean, cleanOptions),
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
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(ttf|woff|woff2|otf|eot)$/,
                    include: paths.src,
                    rules: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: urljoin(paths.font,'[name].[hash].[ext]'),
                            },
                        }
                    ]
                }
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


    const imageRule = {
        test: /\.(png|jpe?g|svg|bmp|gif|webp)$/,
        include: paths.src,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: urljoin(paths.images, '[name].[hash].[ext]'), //Storing it in images/[name].[ext],
                    // fallback: 'responsive-loader',
                    // adapter: require('responsive-loader/sharp')
                }
            }
        ]
    };

    configBase.module.rules.push(imageRule);
    helpers.responsiveImages(configBase, imageRule);
    configBase.module.rules.push(helpers.extractStyleRule(configBase, extractCss, helpers.sassRule(configBase)));
    configBase.module.rules.push(helpers.extractStyleRule(configBase, extractCss, helpers.lessRule(configBase)));
    configBase.module.rules.push(helpers.extractTextRule(configBase, extractHtml, helpers.pugRule(configBase)));
    configBase.module.rules.push(helpers.jsJSXWithBabel(configBase));
    configBase.module.rules.push(helpers.tsWithTsLoaderRule(configBase));
    return configBase;
};