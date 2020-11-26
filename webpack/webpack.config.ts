import dotenv from "dotenv-defaults";
dotenv.config({
    defaults: ".env.defaults",
});
import * as libConfigs from "./lib/webpack.lib.config";
import * as nodeConfigs from "./node/webpack-project-node";
import * as webConfigs from "./web/webpack-project";
import * as webTestConfigs from "./web/webpack-project.test";

export default [
    webConfigs.webProductionConfig,
    webConfigs.webDevConfig,
    nodeConfigs.nodeProductionConfig,
    nodeConfigs.nodeDevConfig,
    libConfigs.libESConfig,
    libConfigs.libUmdConfig,
    webTestConfigs.testConfig,
];
