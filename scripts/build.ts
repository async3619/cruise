import path from "path";
import { minify } from "terser";
import glob from "fast-glob";
import * as fs from "fs-extra";

import mainConfig from "../config/tsconfig.main.json";
import rendererConfig from "../config/webpack.config.renderer";

import { TypescriptCompiler } from "./utils/compiler/typescript";
import { WebpackCompiler } from "./utils/compiler/webpack";

import { clean } from "./clean";
import { logger } from "./utils/logger";
import chalk from "chalk";

const ANALYZE = process.argv.includes("--analyze");

async function buildApp() {
    await clean();

    const mainCompiler = new TypescriptCompiler("main", path.join(process.cwd(), "config", "tsconfig.main.json"));
    const rendererCompiler = new WebpackCompiler(rendererConfig(false, ANALYZE, 0));

    const mainCompileSucceeded = await mainCompiler.run();
    if (!mainCompileSucceeded) {
        return;
    }

    const distPath = path.join(process.cwd(), "config", mainConfig.compilerOptions.outDir);
    await fs.copy(path.join(distPath, "src"), path.join(distPath), { overwrite: true });
    await fs.rm(path.join(distPath, "src"), { force: true, recursive: true });

    const targetFilePath = await glob(["**/*.js", "*.js"], {
        cwd: distPath,
    });

    const minifyStartedTime = Date.now();
    logger.info("started to minify files ...");

    for (const filePath of targetFilePath) {
        try {
            const targetPath = path.join(distPath, filePath);
            const fileContent = await fs.readFile(targetPath, "utf-8");
            const { code } = await minify(fileContent, {
                keep_classnames: true,
                mangle: true,
                compress: true,
            });

            if (!code) {
                throw new Error("failed to minify");
            }

            await fs.writeFile(targetPath, code);
        } catch (e) {
            logger.error("failed to minify file: " + filePath);
            console.log();
            console.error(e);

            return;
        }
    }

    const minifyElapsedTime = Date.now() - minifyStartedTime;
    logger.info(`complete to minify files. ${chalk.gray(`(${minifyElapsedTime}ms)`)}`);

    const rendererCompileSucceeded = await rendererCompiler.run();
    if (!rendererCompileSucceeded) {
        return;
    }
}

buildApp();
