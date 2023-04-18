import path from "path";

import rendererConfig from "../config/webpack.config.renderer";

import { TypescriptCompiler } from "./utils/compiler/typescript";
import { WebpackCompiler } from "./utils/compiler/webpack";

import { clean } from "./clean";

const ANALYZE = process.argv.includes("--analyze");

async function buildApp() {
    await clean();

    const mainCompiler = new TypescriptCompiler("main", path.join(process.cwd(), "config", "tsconfig.main.json"));
    const rendererCompiler = new WebpackCompiler(rendererConfig(false, ANALYZE, 0));

    const mainCompileSucceeded = await mainCompiler.run();
    if (!mainCompileSucceeded) {
        return;
    }

    const rendererCompileSucceeded = await rendererCompiler.run();
    if (!rendererCompileSucceeded) {
        return;
    }
}

buildApp();
