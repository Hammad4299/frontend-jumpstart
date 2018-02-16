let paths = require('./webpack-path-base.config')();
const webpack = require('webpack');

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
    jsJSXWithBabelWithoutThreadLoader: jsJSXWithBabelWithoutThreadLoader
};


function baseTypescriptRule() {
    return {
        test: /\.ts[x]*$/,
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
    const rule = baseTypescriptRule();
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
    const rule = baseTypescriptRule();
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