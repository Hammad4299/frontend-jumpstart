delete process.env.TS_NODE_PROJECT
import path from 'path';
import webpackMerge from 'webpack-merge';
import commonConfig from './webpack.config';
import TerserPlugin  from 'terser-webpack-plugin'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';

import projectConfig, {prodConfigModifier, imagminOptions, imagminWebpOptions} from "./webpack-project";
import {constructConfigOptions} from "./webpack-utils";
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';

const modifier = constructConfigOptions(prodConfigModifier);
const config = webpackMerge(commonConfig(modifier), {
    //devtool: 'source-map',            //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
    mode: 'production',
    devtool: 'nosources-source-map',  //Production ready separate sourcemap files with no original source code. SourceMaps Can be deployed securely
    optimization: {
        minimizer: [
            new TerserPlugin ({
                cache: true,
                parallel: true,
                sourceMap: true, // set to true if you want JS source maps
            })
        ]
    },
    plugins: [
        new MomentLocalesPlugin(),
        new CompressionPlugin({
            threshold: 0,
            test: /\.(js|css|ttf|otf|eot)/
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    ]
});

export default config;