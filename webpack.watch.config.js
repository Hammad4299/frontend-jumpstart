"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var webpack_merge_1 = __importDefault(require("webpack-merge"));
var webpack_config_1 = __importDefault(require("./webpack.config"));
var config = webpack_merge_1["default"](webpack_config_1["default"](), {
    mode: 'development',
    devtool: 'source-map'
});
exports["default"] = config;
