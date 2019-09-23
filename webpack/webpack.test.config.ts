delete process.env.TS_NODE_PROJECT
import dotenv from "dotenv-defaults"
dotenv.config({
    defaults: ".env.defaults",
})
import path from "path"
import webpackMerge from "webpack-merge"
import commonConfig from "./webpack.config"
import TerserPlugin from "terser-webpack-plugin"
import CompressionPlugin from "compression-webpack-plugin"
import webProjectConfig from "./webpack-project.test"
import { baseOptions } from "./webpack-common"
import MomentLocalesPlugin from "moment-locales-webpack-plugin"
import webpack from "webpack"
process.env.TS_NODE_PROJECT = path.resolve(__dirname, "./tsconfig.json")

const config = webpackMerge(
    commonConfig(webProjectConfig, {
        ...baseOptions.test,
        hmrNeeded: false,
        cacheResults: false, //don't cache production, run from scratch
        enableCacheBusting: false,
        extractCss: true,
        lint: false,
        imagemin: true,
        minimizeCss: true,
        responsiveImages: true,
        shouldClean: true,
        shouldGenerateSourceMaps: true,
    }),
    {
        //devtool: 'source-map',            //Production ready separate sourcemap files with original source code. SourceMaps Can be deployed but make sure to not allow access to public users to them.
        mode: "production",
        target: "web",
        name: webProjectConfig.name,
        devtool: "nosources-source-map", //Production ready separate sourcemap files with no original source code. SourceMaps Can be deployed securely
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true, // set to true if you want JS source maps
                }),
            ],
        },
        plugins: [
            new MomentLocalesPlugin(),
            new CompressionPlugin({
                threshold: 0,
                test: /\.(js|css|ttf|otf|eot)/,
            }),
            // new BundleAnalyzerPlugin({
            //     analyzerMode: "static",
            // }),
        ],
    } as webpack.Configuration
)

export default [config]
