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
    if (fs.existsSync(umdRoot.src)) {
        fs.move(umdRoot.src, umdRoot.dest, {
            overwrite: true,
        });
    }
    if (fs.existsSync(esmRoot.src)) {
        fs.move(esmRoot.src, esmRoot.dest, {
            overwrite: true,
        });
    }
});
