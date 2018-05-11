import path from 'path';
import * as _ from 'lodash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
//noinspection TypeScriptCheckImport
import responsiveSharp from 'responsive-loader/sharp';
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import Favicon from 'favicons-webpack-plugin';
import urljoin from 'url-join';
import ManifestPlugin from 'webpack-manifest-plugin';
import { TsConfigPathsPlugin, CheckerPlugin } from 'awesome-typescript-loader';
import env from './webpack.env';
import NullPlugin from 'webpack-null-plugin';
//noinspection TypeScriptUnresolvedVariable
import SplitChunksOptions = webpack.Options.SplitChunksOptions;


//TODO make css source map work with eval-source-map
//TODO webp-loader might help in producing 2 outputs for images, one in current format, other in webp
//TODO dynamic code splitting
//TODO react, redux, react-dom

export interface IBaseConfigOptions {
    readonly shouldClean?: boolean;
    readonly shouldGenerateSourceMaps?: boolean;
    readonly isFaviconNeeded?: boolean;
    readonly hmrNeeded?: boolean;
    readonly minimizeCss?: boolean;
    buildOutputName?(name:string, hashedPart:string): string;
}

function constructConfigOptions(options:IBaseConfigOptions = {}){
    //noinspection TypeScriptUnresolvedFunction
    return _.defaults(options,{
        shouldClean: true,
        isFaviconNeeded: false,
        minimizeCss: false,
        hmrNeeded: false,
        shouldGenerateSourceMaps: true,
        buildOutputName: (name:string, hashedPart:string)=>{
            return name
        }
    });
}


// the clean options to use
let cleanOptions = {
    root:     __dirname,
    exclude:  [],
    verbose:  false,
    dry:      false,
    watch: false		//It could cause issues, e.g. webpack only copies modified images via copy plugin not all images, so we should not clear images on watch
};

const cleanupPlugin = new CleanWebpackPlugin(env.clean, cleanOptions);
const copyPlugin = new CopyWebpackPlugin(env.copy);


export default function buildBaseConfig(modifier:IBaseConfigOptions={}){
    modifier = constructConfigOptions(modifier);

    return {
        entry: {
            index: path.join(env.src, 'index.ts'),
            //page: path.join(env.src, 'js/page.js'),
            page2: path.join(env.src, 'js/page2.js'),
        },
        output: {
            path: path.resolve(env.contentOutput),
            filename: modifier.buildOutputName('js/[name].hash-[chunkhash].js','.hash-[chunkhash]'),       //js output
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
                        name: 'vendor'
                    },
                    common: {   //default config used by "default" cache group, just renamed it to "common:
                        name: 'common',
                        minChunks: 2,
                        priority: -10,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        externals: {
            myExternal: 'external' //now import xyz from 'myExternal' should work
            // window: 'window',
            // jquery: 'jQuery'     //e.g. import $ from 'jquery'
        },
        resolve: {
            alias: {
                js: path.resolve(env.src, 'js'),
                images: path.resolve(env.src, 'images')
            },
            modules: ['node_modules'],
            //extensions: [
            //     'js', 'jsx', 'ts', 'tsx'
            // ],
            plugins: [
                new TsConfigPathsPlugin(/* { configFileName, compiler } */)
            ]
        },
        module: {
            rules: [
                {
                    test: /\.(ts[x]|js[x])$/,
                    include: path.resolve(env.src),
                    use: [
                        'awesome-typescript-loader'
                    ]
                },
                {
                    test: /\.[s][ca]ss$/,
                    include: path.resolve(env.src),
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
                                minimize: modifier.minimizeCss ? {
                                    zindex:false,
                                    safe: true,
                                    sourcemap: modifier.shouldGenerateSourceMaps,
                                    discardComments: { removeAll: true }
                                } : false,
                                importLoaders: 2,   //how many loaders before css-loader should be applied to @imported resources.
                                sourceMap: modifier.shouldGenerateSourceMaps
                            }
                        }, {
                            loader: "sass-loader", // creates style nodes from JS strings
                            options: {
                                sourceMap: modifier.shouldGenerateSourceMaps
                            }
                        }, {
                            loader: "postcss-loader", // creates style nodes from JS strings
                            options: {
                                sourceMap: modifier.shouldGenerateSourceMaps
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|svg|bmp|gif|webp)$/,
                    include: env.src,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: urljoin(env.images, modifier.buildOutputName('[name].hash-[hash].[ext]','.hash-[hash]')), //Storing it in images/[name].[ext],
                                fallback: 'responsive-loader',
                                adapter: responsiveSharp
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|woff|woff2|otf|eot)$/,
                    include: path.resolve(env.src),
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: urljoin(env.font, modifier.buildOutputName('[name].hash-[hash].[ext]','.hash-[hash]')),
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
                filename: modifier.buildOutputName("css/[name].hash-[chunkhash].css",'.hash-[chunkhash]'),
                //chunkFilename: modifier.buildOutputName("css/[id].hash-[chunkhash].css",'.hash-[chunkhash]')
            }),
            modifier.shouldClean ? cleanupPlugin : new NullPlugin(),
            copyPlugin,
            new CheckerPlugin(),
            modifier.isFaviconNeeded ? new Favicon({
                logo: path.resolve(env.src,env.images,'download.png'),
                prefix: modifier.buildOutputName('faviicons.hash-[hash]/','.hash-[hash]'),
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
                map: (obj)=>{
                    if(obj.name){
                        obj.name = obj.name.replace(/\.hash-.*\./,'.'); //fixes imagemin hashes
                    }

                    return obj;
                }
            })
        ],
    };
}