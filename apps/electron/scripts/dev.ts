import chalk from "chalk";
import getPort from "get-port";
import path from "path";
import { createServer } from "vite";
import { ChildProcess } from "child_process";
import fs from "fs-extra";

import { TypescriptCompiler } from "./compilers/typescript";

import { logger } from "./utils/logger";
import { spawnProcess, treeKillSync } from "./utils/process";

let childProcessRef: ChildProcess | undefined = undefined;
const handleClose = () => childProcessRef?.pid && treeKillSync(childProcessRef.pid);
process.on("SIGINT", handleClose);
process.on("SIGTERM", handleClose);
process.on("exit", handleClose);

function startElectronApp(port: number, onClose: () => void) {
    if (childProcessRef?.pid) {
        logger.info("restarting electron app...");

        childProcessRef.removeAllListeners("exit");
        childProcessRef.on("exit", () => {
            childProcessRef = spawnProcess(port);
            childProcessRef.on("exit", () => {
                onClose();
                childProcessRef = undefined;
            });
        });

        childProcessRef.stdin && (childProcessRef.stdin as typeof process.stdin).pause();
        treeKillSync(childProcessRef.pid);
    } else {
        logger.info("starting electron app...");

        childProcessRef = spawnProcess(port);
        childProcessRef.on("exit", (code: number) => {
            onClose();
            (process as any).exitCode = code;
            childProcessRef = undefined;
        });
    }
}

async function dev() {
    logger.info("cleaning dist directories ...");
    await Promise.all([
        fs.remove(path.join(process.cwd(), "..", "main", "dist")),
        fs.remove(path.join(process.cwd(), "..", "renderer", "dist")),
    ]);

    const availablePort = await getPort({ port: 3000 });
    const mainCompiler = new TypescriptCompiler("main", path.join(process.cwd(), "..", "main", "tsconfig.build.json"));
    const rendererServer = await createServer({
        configFile: path.join(process.cwd(), "..", "renderer", "vite.config.ts"),
        root: path.join(process.cwd(), "..", "renderer"),
    });

    await rendererServer.listen(availablePort);
    logger.info(`renderer dev server is started to listen on port ${chalk.green(availablePort)}.`);

    mainCompiler.on("success", async () => {
        startElectronApp(availablePort, async () => {
            await rendererServer.close();
            process.exit(0);
        });
    });

    await mainCompiler.start();
}

dev();
