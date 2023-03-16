import { resolve } from "path";
import * as fs from "fs";

import { defineConfig, externalizeDepsPlugin, swcPlugin } from "electron-vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";

const tsconfig = fs.readFileSync("./tsconfig.json", "utf8");
const tsconfigJson = JSON.parse(tsconfig);
const paths = tsconfigJson.compilerOptions.paths;

const alias: Record<string, string> = {};
for (const key in paths) {
    const value = paths[key][0];
    alias[key] = resolve(__dirname, value.replace("/*", ""));
}

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin(), swcPlugin()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, "src/index.ts"),
                },
            },
        },
        resolve: {
            alias: {
                "@main": resolve(__dirname, "src"),
            },
        },
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, "src/preload.ts"),
                },
            },
        },
    },
    renderer: {
        root: ".",
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, "index.html"),
                },
            },
        },
        plugins: [
            react({
                plugins: [["@swc/plugin-emotion", {}]],
            }),
            tsconfigPaths(),
            checker({
                typescript: true,
            }),
        ],
    },
});
