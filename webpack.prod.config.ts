import env from './webpack.env';
import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin';
import path from 'path';
import {ImageminWebpackPlugin} from "imagemin-webpack";
import ImageminGifsicle from "imagemin-gifsicle";
import ImageminJpegtran from "imagemin-jpegtran";
import ImageminOptipng from "imagemin-optipng";
import ImageminSvgo from "imagemin-svgo";
import ImageminWebp from 'imagemin-webp';
import {configDefaults} from "./webpack-project";
import {constructConfigOptions} from "./webpack-utils";
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';




const modifier = constructConfigOptions({
    shouldClean: true,
    cacheResults: false,    //don't cache production, run from scratch
    minimizeCss: true
},configDefaults);
const config = webpackMerge(commonConfig(modifier), {
    //devtool: 'source-map',            //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
    mode: 'production',
    devtool: 'nosources-source-map',  //Production ready separate sourcemap files with no original source code. SourceMaps Can be deployed securely
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            })
        ]
    },
    plugins: [
        new CompressionPlugin({
            threshold: 0,
            test: /\.(js|css|ttf|otf|eot)/
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    ]
});

const imagemin = new ImageminWebpackPlugin({
    //test: /\.(jpe?g|png|gif|svg)$/i,
    name: modifier.buildOutputName('image-imagemin'),
    imageminOptions: {
        // Lossless optimization with custom option
        plugins: [
            ImageminGifsicle({
                interlaced: true
            }),
            ImageminJpegtran({
                progressive: true
            }),
            ImageminOptipng({
                optimizationLevel: 1
            }),
            ImageminSvgo({
                removeViewBox: true
            }),
            // ImageminWebp({
            //     loseless: true
            // })
        ]
    }
});

config.plugins.push(imagemin);
export default config;