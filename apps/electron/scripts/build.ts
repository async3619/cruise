import path from "path";
import fs from "fs-extra";

import { logger } from "./utils/logger";

const RENDERER_DIST = path.join(process.cwd(), "..", "renderer", "dist");
const MAIN_DIST = path.join(process.cwd(), "..", "main", "dist");
const MAIN_PACKAGE_JSON_PATH = path.join(process.cwd(), "..", "main", "package.json");
const ELECTRON_DIST = path.join(process.cwd(), "dist");

async function build() {
    logger.info("cleaning dist directory...");
    await fs.remove(ELECTRON_DIST);

    // copy each dist to electron dist directory
    logger.info("copying dist files...");

    await fs.copy(MAIN_DIST, ELECTRON_DIST);
    await fs.copy(RENDERER_DIST, path.join(ELECTRON_DIST, "renderer"));

    // copy main package.json to electron dist directory
    const whitelists = [
        "name",
        "version",
        "description",
        "author",
        "license",
        "main",
        "dependencies",
        "devDependencies",
    ];
    const mainPackageJson = await fs.readJson(MAIN_PACKAGE_JSON_PATH);
    mainPackageJson.devDependencies = { electron: mainPackageJson.devDependencies.electron };
    mainPackageJson.main = "./main.js";

    for (const key of Object.keys(mainPackageJson)) {
        if (!whitelists.includes(key)) {
            delete mainPackageJson[key];
        }
    }

    await fs.writeJson(path.join(ELECTRON_DIST, "package.json"), mainPackageJson, { spaces: 2 });
}

build();
