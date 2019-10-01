//Base config file.
//TODO make css source map work with eval-source-map
//TODO webp-loader might help in producing 2 outputs for images, one in current format, other in webp
//TODO dynamic code splitting
import webpack from "webpack";
import ImageminWebpackPlugin from "imagemin-webpack";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import Dotenv from "dotenv-webpack";
import path from "path";
import CircularDependencyPlugin from "circular-dependency-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import responsiveSharp from "responsive-loader/sharp";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import Favicon from "favicons-webpack-plugin";
import cssnano from "cssnano";
import { ProjectSettings, Options } from "./webpack-common";
import ManifestPlugin from "webpack-manifest-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import NullPlugin from "webpack-null-plugin";
import postcssPresetEnv from "postcss-preset-env";
import ImageminWebpack from "imagemin-webpack";

function getLoader(
    loaderConfig: webpack.RuleSetUseItem,
    condition: boolean
): webpack.RuleSetUseItem[] {
    return condition ? [loaderConfig] : [];
}

export default function buildBaseConfig(
    projectSettings: ProjectSettings,
    options: Options
) {
    const cleanupPlugin = new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: projectSettings.toClean
    });
    const copyPlugin = new CopyWebpackPlugin(projectSettings.toCopy);
    //required to keep manifest of originally copied files during watch mode.  https://github.com/danethurber/webpack-manifest-plugin/issues/144. Marked to resolve at ManifestPlugin v3
    const manifestSeed: { [index: string]: string } = {};

    const eslintLoader = options.lint
        ? [
              {
                  loader: "eslint-loader"
              }
          ]
        : [];

    const cacheLoader = getLoader(
        {
            loader: "cache-loader",
            options: {
                cacheDirectory: path.resolve(
                    projectSettings.root,
                    "node_modules/.cache/cache-loader"
                )
            }
        },
        options.cacheResults
    );

    let optimizations = projectSettings.optimizations;

    const config: webpack.Configuration = {
        entry: projectSettings.entry,
        output: {
            path: path.resolve(projectSettings.contentOutput),
            //library: '',
            //libraryTarget: 'umd',
            filename: options.buildOutputName("js"),
            pathinfo: false,
            publicPath: process.env.STATIC_CONTENT_URL
        },
        optimization: optimizations,
        externals: projectSettings.externals,
        resolve: {
            alias: projectSettings.alias,
            symlinks: false, // if you don't use symlinks (e.g. npm link or yarn link).
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: process.env.TS_NODE_PROJECT
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.(tsx|jsx|ts|js)$/,
                    exclude: /node_modules/,
                    use: [
                        // 'awesome-typescript-loader', //IMPORTANT this doesn't seem to either tsconfig or calls babel correctly for transpiling. Make sure to test by setting debug true for babel preset env
                        ...cacheLoader,
                        { loader: "babel-loader" }, //ts also handled by babel. It seems faster but doesn't provide typechecking. For that TypeCheckFork plugin is used or run tsc separately
                        ...eslintLoader,
                        {
                            loader: "ts-loader",
                            options: {
                                configFile: process.env.TS_NODE_PROJECT,
                                transpileOnly: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(css|scss|sass)$/,
                    // include: path.resolve(projectSettings.src),
                    use: [
                        ...cacheLoader,
                        options.hmrNeeded || !options.extractCss
                            ? {
                                  loader: "style-loader"
                              }
                            : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader", // creates style nodes from JS strings
                            options: {
                                importLoaders: 2, //how many loaders before css-loader should be applied to @imported resources.
                                sourceMap: options.shouldGenerateSourceMaps
                            }
                        },
                        {
                            loader: "postcss-loader", // creates style nodes from JS strings
                            options: {
                                sourceMap: options.shouldGenerateSourceMaps,
                                ident: "postcss",
                                plugins: () => {
                                    const plugins = [
                                        postcssPresetEnv({
                                            /* use stage 3 features + css nesting rules */
                                            stage: 3,
                                            features: {
                                                "nesting-rules": true
                                            }
                                        })
                                    ];
                                    if (options.minimizeCss) {
                                        plugins.push(cssnano());
                                    }

                                    return plugins;
                                }
                            }
                        },
                        // {
                        //      loader: 'resolve-url-loader',
                        //      options: {
                        //          removeCR: true
                        //      }
                        // },
                        {
                            loader: "sass-loader", // creates style nodes from JS strings
                            options: {
                                sourceMap: options.shouldGenerateSourceMaps
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|svg|bmp|gif|webp)$/,
                    include: projectSettings.src,
                    exclude: path.resolve(projectSettings.src, "webp-images"), //they are handled by another loader
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                context: projectSettings.src, //[path] is relative to this context
                                limit: 10000,
                                name: options.buildOutputName("image"),
                                fallback: options.responsiveImages
                                    ? "responsive-loader"
                                    : "file-loader",
                                //    quality: 100,
                                adapter: responsiveSharp
                            }
                        },
                        ...(options.imagemin
                            ? [
                                  {
                                      loader: ImageminWebpack.loader,
                                      options: options.imageminOptions
                                  }
                              ]
                            : [])
                    ]
                },
                {
                    test: /\.(png|jpe?g|svg|bmp|gif|webp)$/,
                    include: path.resolve(projectSettings.src, "webp-images"),
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 10000,
                                context: projectSettings.src, //[path] is relative to this context
                                name: options.buildOutputName("image"),
                                fallback: options.responsiveImages
                                    ? "responsive-loader"
                                    : "file-loader",
                                //    quality: 100,
                                adapter: responsiveSharp
                            }
                        },
                        ...(options.imagemin
                            ? [
                                  {
                                      loader: ImageminWebpack.loader,
                                      options: options.imageminWebpOptions
                                  }
                              ]
                            : [])
                    ]
                },
                {
                    test: /\.(ttf|woff|woff2|otf|eot)$/,
                    include: path.resolve(projectSettings.src),
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                context: projectSettings.src, //[path] is relative to this context
                                name: options.buildOutputName("font")
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CaseSensitivePathsPlugin(),
            options.htmlPlugin
                ? new HtmlWebpackPlugin({
                      template: "./src/index.html"
                  })
                : new NullPlugin(),
            options.hmrNeeded || !options.extractCss
                ? new NullPlugin()
                : new MiniCssExtractPlugin({
                      // Options similar to the same options in webpackOptions.output
                      // both options are optional
                      filename: options.buildOutputName("style")
                      //chunkFilename: options.buildOutputName("css/[id].hash-[chunkhash].css",'.hash-[chunkhash]')
                  }),
            new Dotenv({
                defaults: true,
                systemvars: true
            }) as any,
            options.shouldClean ? cleanupPlugin : new NullPlugin(),
            copyPlugin,
            new ForkTsCheckerWebpackPlugin({
                checkSyntacticErrors: true,
                tsconfig: process.env.TS_NODE_PROJECT
            }),
            options.favicon
                ? new Favicon({
                      logo: options.favicon.logo,
                      prefix: options.buildOutputName("favicon"),
                      // Emit all stats of the generated icons
                      emitStats: true,
                      // The name of the json containing all favicon information
                      statsFilename: "faviconstats.json",
                      // Generate a cache file with control hashes and
                      // don't rebuild the favicons until those hashes change
                      persistentCache: options.cacheResults,
                      // Inject the html into the html-webpack-plugin
                      inject: false,
                      // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
                      background: "#fff",
                      // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
                      title: "Untitled",
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
                : new NullPlugin(),
            // new CircularDependencyPlugin({
            //     // exclude detection of files based on a RegExp
            //     exclude: /node_modules/,
            //     // add errors to webpack instead of warnings
            //     failOnError: true,
            //     // allow import cycles that include an asyncronous import,
            //     // e.g. via import(/* webpackMode: "weak" */ './file.js')
            //     allowAsyncCycles: false,
            //     // set the current working directory for displaying module paths
            //     cwd: path.resolve(projectSettings.src),
            // }),
            new ManifestPlugin({
                fileName: "webpack-manifest.json",
                writeToFileEmit: true,
                seed: manifestSeed,
                map: (obj: any) => {
                    let name: string = obj.name;
                    if (name) {
                        name = obj.name.replace(/\.hash-.*\./, "."); //fixes imagemin hashes
                        obj.name =
                            name.charAt(0) === "/" ? name.substring(1) : name;
                    }

                    return obj;
                }
            })
        ]
    };

    if (options.imagemin) {
        const imagemin = new ImageminWebpackPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            exclude: /webp-images/,
            loader: false,
            name: options.buildOutputName("image-imagemin"),
            ...options.imageminOptions
        });

        const imagemin2 = new ImageminWebpackPlugin({
            test: /\.(png|jpe?g|webp)$/i,
            loader: false,
            include: /webp-images/,
            name: options.buildOutputName("image-imagemin"),
            ...options.imageminWebpOptions
        });

        config.plugins.push(imagemin);
        config.plugins.push(imagemin2);
    }

    return config;
}
