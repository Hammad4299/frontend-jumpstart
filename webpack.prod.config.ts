import env from './webpack.env';
import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin';
import path from 'path';
//noinspection TypeScriptCheckImport
import {ImageminWebpackPlugin} from "imagemin-webpack";
import ImageminGifsicle from "imagemin-gifsicle";
import ImageminJpegtran from "imagemin-jpegtran";
import ImageminOptipng from "imagemin-optipng";
import ImageminSvgo from "imagemin-svgo";
import ImageminWebp from 'imagemin-webp';


const config = webpackMerge(commonConfig({
    minimizeCss: true
}), {
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
        })
    ]
});

const imagemin = new ImageminWebpackPlugin({
    //test: /\.(jpe?g|png|gif|svg)$/i,
    name: path.join(env.images,"[name].hash-[hash].[ext]"),
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