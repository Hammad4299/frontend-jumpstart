import path from "path";
import glob from "glob";
import { AssetsType, ProjectBuildOptions, ProjectSettings } from "../Types";
import commonConfig from "../webpack-base-config";
import MomentLocalesPlugin from "moment-locales-webpack-plugin";
import webpackMerge from "webpack-merge";
import { projectConfig as baseConfig } from "./webpack-project";
const src = baseConfig.src;
const output = path.resolve(__dirname, "../../tests");
let files = glob.sync(path.join(src, "**/*.spec.ts"));
process.env.TS_NODE_PROJECT = path.resolve(__dirname, "../../tsconfig.json");
const projectConfig: ProjectSettings = {
    ...baseConfig,
    tsconfigPath: path.resolve(__dirname, "../tsconfig.json"),
    buildOutputName: function(type: AssetsType): string {
        let toRet = "";
        switch (type) {
            case "font":
                toRet = `[path][name].[ext]`;
                break;
            case "image-imagemin":
                toRet = `[path][name].[ext]`; // "/" is very important otherwise it will skip first letter (on windows).
                break;
            case "image":
                toRet = `[path]loaded/[name].[ext]`;
                break;
            case "favicon":
                toRet = `favicon/`;
                break;
            case "style":
                toRet = `[name].css`;
                break;
            case "html":
                toRet = `[name].html`;
                break;
            case "js":
                toRet = `[name].js`;
                break;
            default:
                toRet = `[name].[ext]`;
        }
        return toRet;
    },
    contentOutput: output,
    toCopy: [],
    entry: files.reduce((acc, filePath) => {
        const parsed = path.parse(path.relative(src, filePath));
        acc[path.join(parsed.dir, parsed.name)] = filePath;
        return acc;
    }, {})
};

// const imageMinOptions: Partial<ProjectBuildOptions> = {
//     imageminOptions: {
//         imageminOptions: {
//             // Lossless optimization with custom option
//             plugins: [
//                 [
//                     "gifsicle",
//                     {
//                         interlaced: true
//                     }
//                 ],
//                 [
//                     "jpegtran",
//                     {
//                         progressive: true
//                     }
//                 ],
//                 [
//                     "optipng",
//                     {
//                         optimizationLevel: 1
//                     }
//                 ],
//                 [
//                     "svgo",
//                     {
//                         removeViewBox: true
//                     }
//                 ]
//             ]
//         }
//     },
//     imageminWebpOptions: {
//         imageminOptions: {
//             // Lossless optimization with custom option
//             plugins: [
//                 [
//                     "webp",
//                     {
//                         loseless: true
//                     }
//                 ]
//             ]
//         }
//     }
// };

export const testConfig = webpackMerge(
    commonConfig(projectConfig, {
        // ...imageMinOptions,
        hmrNeeded: false,
        cacheResults: false, //don't cache production, run from scratch
        enableCacheBusting: false,
        extractCss: true,
        lint: false,
        imagemin: false,
        minimizeCss: true,
        responsiveImages: true,
        shouldClean: true,
        shouldGenerateSourceMaps: true
    }),
    {
        mode: "development",
        target: ["web", "es5"],
        name: "web-test",
        devtool: "source-map",
        optimization: {
            minimize: false
        },
        plugins: [new MomentLocalesPlugin()]
    }
);