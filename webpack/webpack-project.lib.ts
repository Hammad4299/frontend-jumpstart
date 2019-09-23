import { ProjectSettings } from "./webpack-common"
import path from "path"
import { projectConfig as baseConfig } from './webpack-project'
//Settings specific to this project. Other things if need to be adjusted should be modified directly in config files
const src = baseConfig.src;
const output = path.resolve(__dirname, "../dist/lib")

export const projectConfig: ProjectSettings = {
    ...baseConfig,
    contentOutput: output,
    name: 'libconfig',
    externals: {
        "lodash-es": "_"
    },
    optimizations: {
        runtimeChunk: false,
        splitChunks: false
    },
}

export default projectConfig
