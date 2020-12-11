const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");
const branch = require("git-branch");

branch().then(async (name) => {
    const packageName = `nomad-shared-${name}`;
    const root = path.resolve(__dirname, "../../");
    const collection = "talha5389.test";
    const libRoot = path.join(root, `dist/lib/${name}`);
    const umdRoot = path.join(libRoot, "umd");
    const esmRoot = path.join(libRoot, "esm");
    const typingRoot = path.join(libRoot, "typings");
    {
        let { stdout } = await execa("bit", [
            "add",
            path.join(umdRoot, `/frontend/shared.js`),
            "--id",
            packageName,
        ]);
        console.log(stdout);
    }
    {
        const { stdout } = await execa("bit", [
            "add",
            path.join(umdRoot, `frontend/*`),
            "--id",
            packageName,
        ]);
        console.log(stdout);
    }
    if (fs.existsSync(esmRoot)) {
        const { stdout } = await execa("bit", [
            "add",
            path.join(esmRoot, `frontend/*`),
            "--id",
            packageName,
        ]);
        console.log(stdout);
    }
    {
        let { stdout } = await execa("bit", [
            "add",
            path.join(typingRoot, `**`),
            "--id",
            packageName,
        ]);
        console.log(stdout);
    }
    {
        let { stdout } = await execa("bit", ["tag", packageName]);
        console.log(stdout);
    }
    {
        let { stdout } = await execa("bit", ["export", collection]);
        console.log(stdout);
    }
    if (fs.existsSync(umdRoot)) {
        fs.rmdirSync(umdRoot, {
            recursive: true,
        });
    }
    if (fs.existsSync(esmRoot)) {
        fs.rmdirSync(esmRoot, {
            recursive: true,
        });
    }
    if (fs.existsSync(typingRoot)) {
        fs.rmdirSync(typingRoot, {
            recursive: true,
        });
    }
});
