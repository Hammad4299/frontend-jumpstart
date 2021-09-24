module.exports = (api) => {
    api.caller(() => true);
    return {
        env: {},
        presets: [
            [
                "@babel/preset-env",
                {
                    debug: true,
                    useBuiltIns: "entry",
                    corejs: "3.18.0",
                    //"auto" equals controlled by bundler https://babeljs.io/docs/en/babel-preset-env#modules
                    modules: "auto",
                    //targets seems to be controlled by browserlist rather than bundler https://babeljs.io/docs/en/babel-preset-env#targets
                    // targets: {
                    //     node: api.caller((caller) => caller && caller.target === "node") ? "12" : false,
                    //     chrome: api.caller((caller) => caller && caller.target === "web") ? "58", ie: "11" }: api.caller((caller) => caller && caller.target === "web") ? 12 : false,
                    // },
                },
            ],
            "@babel/preset-react",
        ],
        plugins: [
            "react-hot-loader/babel",
            "@babel/plugin-syntax-dynamic-import",
            "@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread",
        ],
    };
};
