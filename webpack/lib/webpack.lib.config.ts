import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import CircularDependencyPlugin from "circular-dependency-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import webpack from "webpack";
import webpackMerge from "webpack-merge";
import nodeExternals from "webpack-node-externals";

process.env.TS_NODE_PROJECT = path.resolve(__dirname, "./tsconfig.json");

const src = path.resolve(__dirname, "../../src");
const output = path.resolve(__dirname, "../../dist/lib");

export const libUmdConfig: webpack.Configuration = {
    entry: {
        "shared/index": path.join(src, "shared/index.ts"),
    },
    target: "web",
    mode: "production",
    name: "lib-umd",
    devtool: "source-map",
    output: {
        path: path.join(output, "umd"),
        filename: "[name].js",
        pathinfo: false,
        libraryTarget: "umd",
        globalObject: "this",
        library: "shared",
    },
    externals: [nodeExternals()],
    resolve: {
        symlinks: false, // if you don't use symlinks (e.g. npm link or yarn link).
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: process.env.TS_NODE_PROJECT,
            }) as any,
        ],
    },
    module: {
        rules: [
            {
                test: /\.(tsx|jsx|ts|js)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: {
                                            esmodules: true,
                                            node: "12",
                                            browsers: "defaults",
                                        },
                                        useBuiltIns: "entry",
                                        corejs: "3.7.0",
                                    },
                                ],
                            ],
                        },
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: process.env.TS_NODE_PROJECT,
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*"],
        }),
        new CircularDependencyPlugin(),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: process.env.TS_NODE_PROJECT,
            },
        }),
    ],
};

export const libESConfig = webpackMerge(libUmdConfig, {
    name: "lib-es",
    target: ["web", "es2020"],
    experiments: {
        outputModule: true,
    },
    output: {
        path: path.join(output, "esm"),
    },
});
