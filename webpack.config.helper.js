let paths = require('./webpack-path-base.config')();
const webpack = require('webpack');
let urljoin = require('url-join');
const path = require('path');
const glob = require('glob');

const babelLoader = {
    loader: 'babel-loader',
    options: {
        cacheDirectory: true
    }
};

const threadLoader = {
    loader: 'thread-loader',
    options: {
        // there should be 1 cpu for the fork-ts-checker-webpack-plugin
        workers: require('os').cpus().length - 1,
    },
};

function enableHardSourcePlugin(config) {
    const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
    config.plugins.push(
        new HardSourceWebpackPlugin(),  //For build cachings. Can cause issues. If so, try disabling it or deleting its cache folder. (default location node_modules/.cache)
    );
}

function faviconPlugin(config, name, statJsonFile, bg, title) {
    const favicon = require('favicons-webpack-plugin');
    config.plugins.push(
        new favicon({
            logo: name,
            prefix: 'faviicons-[hash]/',
            // Emit all stats of the generated icons
            emitStats: !!statJsonFile,
            // The name of the json containing all favicon information
            statsFilename: statJsonFile ? statJsonFile : 'faviconstats.json',
            // Generate a cache file with control hashes and
            // don't rebuild the favicons until those hashes change
            persistentCache: true,
            // Inject the html into the html-webpack-plugin
            inject: false,
            // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
            background: bg? bg : '#fff',
            // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
            title: title ? title : 'Untitled',
            // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: true,
                favicons: true,
                firefox: true,
                opengraph: true,
                twitter: true,
                yandex: true,
                windows: true
            }
        })
    )
}

function responsiveImages(config, loadersArr) {
    // const obj = {
    //     loader: 'responsive-loader',
    //     options: {
    //         // If you want to enable sharp support:
    //         name: urljoin(paths.images, '[name].[hash].[ext]'), //Storing it in images/[name].[ext]
    //         adapter: require('responsive-loader/sharp')
    //     }
    // };
    //
    // loadersArr.use.push(obj);
}

module.exports = {
    enableHardSourcePlugin: enableHardSourcePlugin,
    tsWithTsLoaderRule: tsWithTsLoaderRule,
    sassRule: sassRule,
    lessRule: lessRule,
    pugRule: pugRule,
    extractTextRule: extractTextRule,
    extractStyleRule: extractStyleRule,
    jsJSXWithBabel: jsJSXWithBabel,
    tsWithATLRule: tsWithATLRule,
    jsJSXWithBabelWithoutThreadLoader: jsJSXWithBabelWithoutThreadLoader,
    responsiveImages: responsiveImages,
    faviconPlugin: faviconPlugin,
    imageminPlugin: imageminPlugin
};

// Make sure that the plugin is after any plugins that add images
function imageminPlugin(configArr, disable) {
    const ImageminPlugin = require('imagemin-webpack-plugin').default;
    const imageminMozjpeg = require('imagemin-mozjpeg');
    const imageminWebp = require('imagemin-webp');

    const pl = new ImageminPlugin({ //non-webp-version
        test: /\.(jpe?g|png|gif|svg)$/i,
        disable: !!disable, // Disable during development
        pngquant: {
            // quality: '65-90',
            // speed: 4
        },
        gifsicle: {
            // interlaced: false,
        },
        jpegtran: null,
        svgo: {
        },
        plugins: [
            imageminMozjpeg({
                // progressive: true,
                // quality: 65
            }),
        ]
    });

    const pl2 = new ImageminPlugin({
        //test: /\.(jpe?g|png)$/i,
        externalImages: {
            context: path.join(paths.src,paths.images), //this will help correct name of destination
            sources: glob.sync(path.join(paths.src,paths.images,'**/*.jpg')),
            destination: path.join(paths.contentOutput,paths.images,'webp')
        },
        disable: !!disable, // Disable during development
        pngquant: null,
        gifsicle: null,
        jpegtran: null,
        svgo: null,
        plugins: [
            imageminWebp({
                loseless: true
            })
        ]
    });

    configArr.plugins.push(pl);
    configArr.plugins.push(pl2);
}

function baseTypescriptRule() {
    return {
        test: /\.ts[x]*$/,
        include: paths.src
    }
}

function baseJavacriptRule() {
    return {
        test: /\.js[x]*$/,
        include: paths.src
    }
}

/**
 * return loadersArray
 */
function baseStyleLoaders() {
    return [
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
        }
    ];
}

/**
 * return loaderRule
 */
function sassRule(config) {
    const loaders = baseStyleLoaders();
    loaders.push({
        loader: "sass-loader",
        options: {
            sourceMap: true
        }
    });

    return {
        test: /\.[s]*css$/,
        include: paths.src,
        use: loaders
    }
}

/**
 * return loaderRule
 */
function lessRule(config) {
    const loaders = baseStyleLoaders();
    loaders.push({
        loader: "less-loader",
        options: {
            sourceMap: true
        }
    });

    return {
        test: /\.less$/,
        include: paths.src,
        use: loaders
    }
}

function pugRule(config) {
    return {
        test: /.pug/,
        include: paths.src,
        use: [{
            loader: "html-loader"
        }, {
            loader: "pug-html-loader",
            options: {
                pretty: true
            }
        }]
    };
}

/**
 * return loaderRule
 */
function extractTextRule(config, extractText, loaderRule) {
    loaderRule.use = extractText.extract({
        use: loaderRule.use,
    });
    if(config.plugins.indexOf(extractText)===-1){
        config.plugins.push(extractText);
    }
    return loaderRule;
}

/**
 * return loaderRule
 */
function extractStyleRule(config, extractText, loaderRule) {
    loaderRule.use = extractText.extract({
        use: loaderRule.use,
        // use style-loader in development
        fallback: {
            loader: "style-loader",
            options: { sourceMap: true }
        }
    });
    if(config.plugins.indexOf(extractText)===-1){
        config.plugins.push(extractText);
    }
    return loaderRule;
}

function tsWithATLRule(config) {
    const rule = baseTypescriptRule();
    rule.use = [
        {
            loader: 'awesome-typescript-loader'
        }
    ];

    return rule;
}

function jsJSXWithBabel(config) {
    const rule = baseJavacriptRule();
    rule.use = [
        {
            loader: 'cache-loader'
        },
        threadLoader,
        babelLoader
    ];
    return rule;
}

function jsJSXWithBabelWithoutThreadLoader(config) {
    const rule = baseJavacriptRule();
    rule.use = [
        babelLoader
    ];
    return rule;
}

function tsWithTsLoaderRule(config) {
    const rule = baseTypescriptRule();
    rule.use = [
        {
            loader: 'cache-loader'
        },
        threadLoader,
        babelLoader,
        {
            loader: 'ts-loader',
            options: { happyPackMode: true }
        }
    ];

    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
    config.plugins.push(new ForkTsCheckerWebpackPlugin({
        checkSyntacticErrors: true,
        //tslint: true,
        watch: [paths.src] // optional but improves performance (less stat calls)
    }));

    config.plugins.push(
        new webpack.WatchIgnorePlugin([
            /\.js$/,
            /\.d\.ts$/
        ])
    );
    return rule;
}