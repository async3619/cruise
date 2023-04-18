import * as fs from "fs-extra";
import path from "path";
import { ChildProcess } from "child_process";

import mainConfig from "../config/tsconfig.main.json";
import rendererConfig from "../config/webpack.config.renderer";

import { TypescriptCompiler } from "./utils/compiler/typescript";
import { treeKillSync, spawnProcess } from "./utils/process";
import { logger } from "./utils/logger";
import { WebpackCompiler } from "./utils/compiler/webpack";
import { getPortPromise } from "portfinder";

let childProcessRef: ChildProcess | undefined = undefined;
process.on("exit", () => childProcessRef?.pid && treeKillSync(childProcessRef.pid));

function startElectronApp(port: number) {
    if (childProcessRef?.pid) {
        logger.info("restarting electron app...");

        childProcessRef.removeAllListeners("exit");
        childProcessRef.on("exit", () => {
            childProcessRef = spawnProcess(port);
            childProcessRef.on("exit", () => (childProcessRef = undefined));
        });

        childProcessRef.stdin && (childProcessRef.stdin as typeof process.stdin).pause();
        treeKillSync(childProcessRef.pid);
    } else {
        logger.info("starting electron app...");

        childProcessRef = spawnProcess(port);
        childProcessRef.on("exit", (code: number) => {
            (process as any).exitCode = code;
            childProcessRef = undefined;
        });
    }
}

async function watchApp() {
    const freePort = await getPortPromise({ port: 4500 });
    const mainCompiler = new TypescriptCompiler("main", path.join(process.cwd(), "config", "tsconfig.main.json"));
    const rendererCompiler = new WebpackCompiler(rendererConfig.bind(null, true), freePort);
    let isFirstCompilation = true;

    mainCompiler.on("start", () => {
        console.clear();
    });

    mainCompiler.on("success", async () => {
        const distPath = path.join(process.cwd(), "config", mainConfig.compilerOptions.outDir);
        await fs.copy(path.join(distPath, "src"), path.join(distPath), { overwrite: true });
        await fs.rm(path.join(distPath, "src"), { force: true, recursive: true });

        if (!rendererCompiler.isStarted()) {
            await rendererCompiler.start();
        }

        if (!isFirstCompilation) {
            startElectronApp(freePort);
        }
    });

    rendererCompiler.on("typeCheckResult", () => {
        if (isFirstCompilation) {
            isFirstCompilation = false;
            startElectronApp(freePort);
        }
    });

    await mainCompiler.start();
}

watchApp();
