const path = require("path");
const fs = require("fs-extra");
const branch = require("git-branch");

branch().then((name) => {
    const root = path.resolve(__dirname, "../../");
    const libRoot = {
        dest: path.join(root, `dist/lib/${name}`),
        src: path.join(root, `dist/lib`),
    };
    const umdRoot = {
        dest: path.join(libRoot.dest, "umd"),
        src: path.join(libRoot.src, "umd"),
    };
    const esmRoot = {
        dest: path.join(libRoot.dest, "esm"),
        src: path.join(libRoot.src, "esm"),
    };
    const typingRoot = {
        dest: path.join(libRoot.dest, "typings"),
        src: path.join(libRoot.src, "typings"),
    };
    fs.move(typingRoot.src, typingRoot.dest, {
        overwrite: true,
    });
});
