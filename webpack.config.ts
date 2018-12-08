//Base config file. 
//TODO make css source map work with eval-source-map
//TODO webp-loader might help in producing 2 outputs for images, one in current format, other in webp
//TODO dynamic code splitting
import webpack from 'webpack';
import ImageminWebpackPlugin from "imagemin-webpack";
import path from 'path';
import * as _ from 'lodash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import responsiveSharp from 'responsive-loader/sharp';
// import hashFiles from 'hash-files';
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import Favicon from 'favicons-webpack-plugin';
import cssnano from 'cssnano';
import ManifestPlugin from 'webpack-manifest-plugin';
// import { TsConfigPathsPlugin, CheckerPlugin } from 'awesome-typescript-loader';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import env from './webpack.env';
import NullPlugin from 'webpack-null-plugin';
import projectSettings from './webpack-project';
import { IBaseConfigOptions, constructConfigOptions } from './webpack-utils';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import postcssPresetEnv from 'postcss-preset-env';
import ImageminWebpack from 'imagemin-webpack';
import { imagminWebpOptions, imagminOptions } from './webpack-project';
// import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

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
//required to keep manifest of originally copied files during watch mode.  https://github.com/danethurber/webpack-manifest-plugin/issues/144. Marked to resolve at ManifestPlugin v3
const manifestSeed:{[index:string]:string} = {};



export default function buildBaseConfig(modifier:IBaseConfigOptions={}){
    modifier = constructConfigOptions(modifier);
    const cacheLoader = modifier.cacheResults ? [{ 
        loader: 'cache-loader', 
        options: {
            cacheDirectory: path.resolve('node_modules/.cache/cache-loader')
        } 
    }] : [];
    const optimizations = modifier.mode !== 'production' ? {
        removeAvailableModules: false,
        removeEmptyChunks: false,
    } : {};
    const config = {
        entry: projectSettings.entry,
        output: {
            path: path.resolve(projectSettings.contentOutput),
            filename: modifier.buildOutputName('js'),
            pathinfo: false,
            publicPath: env.public
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: modifier.splitChucks ? projectSettings.splitChunks : modifier.splitChucks,
            ...optimizations
        },
        externals: projectSettings.externals,
        resolve: {
            alias: {
                'images': path.join(projectSettings.src,'images'),
                'styles': path.join(projectSettings.src,'styles'),
                'fonts': path.join(projectSettings.src,'fonts'),
                'webp-images': path.join(projectSettings.src,'webp-images'),
            },
			,
            symlinks: false, // if you don't use symlinks (e.g. npm link or yarn link).
            extensions: [
                '.js', '.jsx', '.ts', '.tsx'
            ],
            plugins: [
                new TsconfigPathsPlugin(/* { configFileName, compiler } */)
            ]
        },
        module: {
            rules: [
                {
                    test: /\.(tsx|jsx|ts|js)$/,
                    exclude: /node_modules/,
                    use: [
                        // 'awesome-typescript-loader',
                        ...cacheLoader,
                        // ...(()=>{
                        //     return modifier.mode === 'production' ? [{
                        //         loader: 'thread-loader',    //seems to significantly slow down incremental builds as well as production builds
                        //         options: {
                        //             // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                        //             workers: require('os').cpus().length - 1,
                        //         },
                        //     }] : []
                        // })(),
                        { loader: 'babel-loader' },
                        // {
                        //     loader: 'ts-loader',
                        //     options: {
                        //         happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack. Turing this on seems to reduce build time even on incremental builds
                        //         experimentalWatchApi: modifier.mode !== 'production',
                        //         transpileOnly: true
                        //     }
                        // }    //handled by babel. It seems faster but doesn't provide typechecking. For that TypeCheckFork plugin is used
                    ]
                },
                {
                    test: /\.(css|scss|sass)$/,
                    include: path.resolve(projectSettings.src),
                    use: [
                        ...cacheLoader,
                        modifier.hmrNeeded || !modifier.extractCss ? {
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
                                ident: 'postcss',
                                plugins: () => {
                                    const plugins = [
                                        postcssPresetEnv({
                                            /* use stage 3 features + css nesting rules */
                                            stage: 3,
                                            features: {
                                                'nesting-rules': true
                                            }
                                        })
                                    ]
                                    if(modifier.minimizeCss) {
                                        plugins.push(cssnano());
                                    }

                                    return plugins;
                                }
                                // config: {
                                //     path: path.resolve('./'),
                                //     ctx: {
                                //         minimize: modifier.minimizeCss
                                //     }
                                // }
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
                    exclude: path.resolve(projectSettings.src,'webp-images'),   //they are handled by another loader
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                context: projectSettings.src,   //[path] is relative to this context
                                limit: 10000,
                                name: modifier.buildOutputName('image'),
                                fallback: modifier.responsiveImages ? 'responsive-loader' : 'file-loader',
                            //    quality: 100,
                                adapter: responsiveSharp
                            }
                        },
                        ...(modifier.imagemin ? [{
                            loader: ImageminWebpack.loader,
                            options: {
                                ...imagminOptions
                            }
                        }] : [])
                    ]
                },
                {
                    test: /\.(png|jpe?g|svg|bmp|gif|webp)$/,
                    include: path.resolve(projectSettings.src,'webp-images'),
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                context: projectSettings.src,   //[path] is relative to this context
                                name: modifier.buildOutputName('image'),
                                fallback: modifier.responsiveImages ? 'responsive-loader' : 'file-loader',
                            //    quality: 100,
                                adapter: responsiveSharp
                            }
                        },
                        ...(modifier.imagemin ? [{
                            loader: ImageminWebpack.loader,
                            options: {
                                ...imagminWebpOptions
                            }
                        }]: [])
                    ]
                },
                {
                    test: /\.(ttf|woff|woff2|otf|eot)$/,
                    include: path.resolve(projectSettings.src),
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                context: projectSettings.src,   //[path] is relative to this context
                                name: modifier.buildOutputName('font'),
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            modifier.htmlPlugin ? new HtmlWebpackPlugin() : new NullPlugin(),
            modifier.hmrNeeded || !modifier.extractCss ? new NullPlugin() : new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: modifier.buildOutputName('style'),
                //chunkFilename: modifier.buildOutputName("css/[id].hash-[chunkhash].css",'.hash-[chunkhash]')
            }),
            modifier.shouldClean ? cleanupPlugin : new NullPlugin(),
            // modifier.cacheResults ? new HardSourceWebpackPlugin({    //seems to slowdown/no speed effect rather than speed up especially incremental builds
            //     // Either an absolute path or relative to webpack's options.context.
            //     cacheDirectory: path.resolve('node_modules/.cache/hard-source/[confighash]'),
            //     // Either a string of object hash function given a webpack config.
            //     configHash: function(webpackConfig) {
            //       // node-object-hash on npm can be used to build this.
            //       return require('node-object-hash')({sort: false}).hash({
            //           webpack: webpackConfig,
            //           babelrc: hashFiles.sync({
            //               files: [path.resolve('./.babelrc')]
            //           }),
            //           tsconfig: hashFiles.sync({
            //             files: [path.resolve('./tsconfig.json')]
            //         }),
            //       });
            //     },
            //     // Either false, a string, an object, or a project hashing function.
            //     environmentHash: {
            //       root: process.cwd(),
            //       directories: [],
            //       files: ['package-lock.json', 'yarn.lock'],
            //     },
            //     // An object.
            //     info: {
            //       // 'none' or 'test'.
            //       mode: 'none',
            //       // 'debug', 'log', 'info', 'warn', or 'error'.
            //       level: 'debug',
            //     },
            //     // Clean up large, old caches automatically.
            //     cachePrune: {
            //       // Caches younger than `maxAge` are not considered for deletion. They must
            //       // be at least this (default: 2 days) old in milliseconds.
            //       maxAge: 1 * 24 * 60 * 60 * 1000,
            //       // All caches together must be larger than `sizeThreshold` before any
            //       // caches will be deleted. Together they must be at least this
            //       // (default: 50 MB) big in bytes.
            //       sizeThreshold: 50 * 1024 * 1024
            //     },
            // }) : NullPlugin(),
            copyPlugin,
            // new ForkTsCheckerWebpackPlugin({ 
            //     checkSyntacticErrors: true
            // }),
            modifier.favicon ? new Favicon({
                logo: modifier.favicon.logo,
                prefix: modifier.buildOutputName('favicon'),
                // Emit all stats of the generated icons
                emitStats: true,
                // The name of the json containing all favicon information
                statsFilename: 'faviconstats.json',
                // Generate a cache file with control hashes and
                // don't rebuild the favicons until those hashes change
                persistentCache: modifier.cacheResults,
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
                seed: manifestSeed,
                map: (obj:any)=>{
                    let name:string = obj.name;
                    if(name){
                        name = obj.name.replace(/\.hash-.*\./,'.'); //fixes imagemin hashes 
                        obj.name = name.charAt(0) === '/' ? name.substring(1) : name;
                    }

                    return obj;
                }
            })
        ],
    };
    
    if(modifier.imagemin) {
        const imagemin = new ImageminWebpackPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            exclude: /webp-images/,
            loader: false,
            name: modifier.buildOutputName('image-imagemin'),
            ...imagminOptions
        });
        
        const imagemin2 = new ImageminWebpackPlugin({
            test: /\.(png|jpe?g|webp)$/i,
            loader: false,
            include: /webp-images/,
            name: modifier.buildOutputName('image-imagemin'),
            ...imagminWebpOptions
        });
        
        config.plugins.push(imagemin);
        config.plugins.push(imagemin2);
    }
    
    return config;
}