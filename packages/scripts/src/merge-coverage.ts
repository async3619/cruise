// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./global.d.ts" />

import glob from "fast-glob";
import path from "path";
import istanbul from "istanbul-lib-coverage";
import fs from "fs-extra";

(async () => {
    const rootPath = path.resolve(__dirname, "../../../");
    const coveragePath = path.resolve(rootPath, "coverage");

    await fs.ensureDir(coveragePath);

    const coverageFilePaths = await glob(["**/coverage-final.json"], {
        cwd: rootPath,
        ignore: ["**/node_modules/**", "./coverage/**"],
    }).then(paths => paths.map(p => path.resolve(rootPath, p)));

    console.log(coverageFilePaths);

    const map = istanbul.createCoverageMap({});
    for (const filePath of coverageFilePaths) {
        const json = await fs.readJson(filePath);
        map.merge(json);
    }

    const output = JSON.stringify(map);
    await fs.writeFile(path.resolve(coveragePath, "coverage-final.json"), output);
})();
