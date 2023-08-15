import fs from "fs-extra";
import path from "path";
import * as builder from "electron-builder";

import config from "../electron-builder.config";
import { logger } from "./utils/logger";

const DIST_PATH = path.join(process.cwd(), "dist");

async function pack() {
    logger.info("cleaning package directory...");
    fs.removeSync(path.join(process.cwd(), "packages"));

    logger.info("writing .npmrc file for dependencies...");
    fs.writeFileSync(path.join(DIST_PATH, ".npmrc"), "node-linker=hoisted");

    logger.info("start packaging...");
    await builder.build({ config });
}

pack();
