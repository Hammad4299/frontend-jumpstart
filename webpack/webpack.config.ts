//Base config file. 
//TODO make css source map work with eval-source-map
//TODO webp-loader might help in producing 2 outputs for images, one in current format, other in webp
//TODO dynamic code splitting

import path from 'path';
import * as _ from 'lodash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import responsiveSharp from 'responsive-loader/sharp';
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import Favicon from 'favicons-webpack-plugin';
import urljoin from 'url-join';
import ManifestPlugin from 'webpack-manifest-plugin';
import { TsConfigPathsPlugin, CheckerPlugin } from 'awesome-typescript-loader';
import env from './webpack.env';
import NullPlugin from 'webpack-null-plugin';
import SplitChunksOptions = webpack.Options.SplitChunksOptions;
import projectSettings,{configDefaults} from './webpack-project';
import { IBaseConfigOptions, constructConfigOptions } from './webpack-utils';

// the clean options to use
let cleanOptions = {
    root:     projectSettings.root,
    exclude:  [],
    verbose:  false,
    dry:      false,
    watch: false		//It could cause issues, e.g. webpack only copies modified images via copy plugin not all images, so we should not clear images on watch
};

const cleanupPlugin = new CleanWebpackPlugin(projectSettings.toClean, cleanOptions);
const copyPlugin = new CopyWebpackPlugin(projectSettings.toCopy);

export default function buildBaseConfig(modifier:IBaseConfigOptions={}){
    modifier = constructConfigOptions(modifier,configDefaults);
    return {
        entry: projectSettings.entry,
        output: {
            path: path.resolve(projectSettings.contentOutput),
            filename: modifier.buildOutputName('js'),
            publicPath: env.public
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: <SplitChunksOptions>{
                chunks: "all",
                automaticNameDelimiter: '-',
                cacheGroups: {
                    default: false,
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        name: projectSettings.splitChunks.cacheGroups['vendors'].name
                    },
                    common: {   //default config used by "default" cache group, just renamed it to "common:
                        name: projectSettings.splitChunks.cacheGroups['common'].name,
                        minChunks: 2,
                        priority: -10,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        externals: projectSettings.externals,
        resolve: {
            modules: ['node_modules'],
            extensions: [
                '.js', '.jsx', '.ts', '.tsx'
            ],
            plugins: [
                new TsConfigPathsPlugin(/* { configFileName, compiler } */)
            ]
        },
        module: {
            rules: [
                {
                    test: /\.(tsx|jsx|ts|js)$/,
                    use: [
                        'awesome-typescript-loader'
                    ]
                },
                {
                    test: /\.(css|scss|sass)$/,
                    include: path.resolve(projectSettings.src),
                    use: [
                        modifier.hmrNeeded ? {
                            loader: 'style-loader',
                            options: {
                                sourceMap: modifier.shouldGenerateSourceMaps
                            }
                        } : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader", // creates style nodes from JS strings
                            options: {
                                importLoaders: 2,   //how many loaders before css-loader should be applied to @imported resources.
                                sourceMap: modifier.shouldGenerateSourceMaps
                            }
                        }, {
                            loader: "postcss-loader", // creates style nodes from JS strings
                            options: {
                                sourceMap: modifier.shouldGenerateSourceMaps,
                                config: {
                                    path: path.resolve('./'),
                                    ctx: {
                                        minimize: modifier.minimizeCss
                                    }
                                }
                            }
                        }, {
                            loader: "sass-loader", // creates style nodes from JS strings
                            options: {
                                sourceMap: modifier.shouldGenerateSourceMaps
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|svg|bmp|gif|webp)$/,
                    include: projectSettings.src,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: modifier.buildOutputName('image'),
                                fallback: 'responsive-loader',
 //                               quality: 100,
                                adapter: responsiveSharp
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|woff|woff2|otf|eot)$/,
                    include: path.resolve(projectSettings.src),
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: modifier.buildOutputName('font'),
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin(),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: modifier.buildOutputName('style'),
                //chunkFilename: modifier.buildOutputName("css/[id].hash-[chunkhash].css",'.hash-[chunkhash]')
            }),
            modifier.shouldClean ? cleanupPlugin : new NullPlugin(),
            copyPlugin,
            new CheckerPlugin(),
            modifier.favicon ? new Favicon({
                logo: modifier.favicon.logo,
                prefix: modifier.buildOutputName('favicon'),
                // Emit all stats of the generated icons
                emitStats: true,
                // The name of the json containing all favicon information
                statsFilename: 'faviconstats.json',
                // Generate a cache file with control hashes and
                // don't rebuild the favicons until those hashes change
                persistentCache: true,
                // Inject the html into the html-webpack-plugin
                inject: false,
                // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
                background: '#fff',
                // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
                title: 'Untitled',
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
            }) : new NullPlugin(),
            new ManifestPlugin({
                fileName: 'webpack-manifest.json',
                writeToFileEmit: true,
                map: (obj:any)=>{
                    if(obj.name){
                        obj.name = obj.name.replace(/\.hash-.*\./,'.'); //fixes imagemin hashes
                    }

                    return obj;
                }
            })
        ],
    };
}