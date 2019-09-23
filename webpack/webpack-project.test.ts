import { ProjectSettings } from "./webpack-common";
import path from "path";
import glob from "glob";
import { projectConfig as baseConfig } from "./webpack-project";
//Settings specific to this project. Other things if need to be adjusted should be modified directly in config files
const src = baseConfig.src;
const output = path.resolve(__dirname, "../tests");
let files = glob.sync(path.join(src, "**/*.spec.ts"));

export const projectConfig: ProjectSettings = {
    ...baseConfig,
    contentOutput: output,
    name: "testconfig",
    toCopy: [],
    entry: files.reduce((acc,filePath)=>{
        const parsed = path.parse(path.relative(src,filePath))
        acc[path.join(parsed.dir,parsed.name)] = filePath;
        return acc;
    },{}),
    optimizations: {
        runtimeChunk: false,
        splitChunks: false
    }
};

export default projectConfig;
