import * as path from "path";
import * as fs from "fs-extra";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import noBundlePlugin from "vite-plugin-no-bundle";
import typescript from "@rollup/plugin-typescript";
import ttypescript from "ttypescript";

import pkg from "./package.json";

const devServerUrl = "http://127.0.0.1:7777/";

// https://vitejs.dev/config/
export default defineConfig(() => {
    fs.rm(path.join(__dirname, "dist-main"), { recursive: true, force: true });

    return {
        plugins: [
            electron([
                {
                    entry: ["src-main/index.ts"],
                    vite: {
                        plugins: [
                            typescript({
                                typescript: ttypescript,
                            }),
                            noBundlePlugin({
                                root: "src-main",
                            }),
                            tsconfigPaths({
                                projects: ["./tsconfig.json"],
                            }),
                        ],
                        build: {
                            lib: {
                                entry: "src-main/index.ts",
                            },
                            minify: false,
                            outDir: "dist-main",
                            rollupOptions: {
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
                {
                    entry: "src-main/preload.ts",
                    onstart(options) {
                        // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                        // instead of restarting the entire Electron App.
                        options.reload();
                    },
                    vite: {
                        build: {
                            outDir: "dist-main",
                            rollupOptions: {
                                external: Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                            },
                        },
                    },
                },
            ]),

            react({
                plugins: [["@swc/plugin-emotion", {}]],
            }),
            tsconfigPaths(),

            // Use Node.js API in the Renderer-process
            renderer({
                nodeIntegration: true,
            }),
        ],
        server: !!process.env.VSCODE_DEBUG
            ? (() => {
                  const url = new URL(devServerUrl);
                  return {
                      host: url.hostname,
                      port: +url.port,
                  };
              })()
            : undefined,
        clearScreen: false,
    };
});
