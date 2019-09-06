import { ProjectSettings } from "./webpack-common"
import nodeExternals from "webpack-node-externals"
import path from "path"

//Settings specific to this project. Other things if need to be adjusted should be modified directly in config files
const src = path.resolve(__dirname, "../src")
const output = path.resolve(__dirname, "../dist-node")

export const projectConfig: ProjectSettings = {
    entry: {
        index: path.join(src, "js/index.ts"),
    },
    externals: [nodeExternals()],
    src: src,
    alias: {
        images: path.join(src, "images"),
        styles: path.join(src, "styles"),
        fonts: path.join(src, "fonts"),
        "webp-images": path.join(src, "webp-images"),
    },
    contentOutput: output,
    toClean: [
        //relative to "root"
        "**/*",
    ],
    toCopy: [
        { from: path.join(src, "images"), to: path.join(output, "images") },
        {
            from: path.join(src, "webp-images"),
            to: path.join(output, "webp-images"),
        },
        { from: path.join(src, "fonts"), to: path.join(output, "fonts") },
    ],
    root: path.resolve(src, "../"),
    optimizations: {
        runtimeChunk: false,
        splitChunks: false,
        nodeEnv: false,
    },
}

export default projectConfig
