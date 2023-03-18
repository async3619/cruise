import { resolve } from "path";
import fs from "fs-extra";

import { defineConfig, externalizeDepsPlugin, swcPlugin } from "electron-vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";

import glob from "fast-glob";

const tsconfig = fs.readFileSync("./tsconfig.json", "utf8");
const tsconfigJson = JSON.parse(tsconfig);
const paths = tsconfigJson.compilerOptions.paths;

const alias: Record<string, string> = {};
for (const key in paths) {
    const value = paths[key][0];
    alias[key] = resolve(__dirname, value.replace("/*", ""));
}

// get all modules from node_modules
const modules = glob.sync("node_modules/**/package.json", {
    onlyFiles: true,
    cwd: process.cwd(),
});

// get all names of modules
const moduleNames = modules
    .map(module => {
        try {
            return fs.readJsonSync(module).name;
        } catch (e) {
            return undefined;
        }
    })
    .filter(name => Boolean(name));

export default defineConfig({
    main: {
        plugins: [
            externalizeDepsPlugin({
                include: [...moduleNames, "@as-integrations/fastify"],
            }),
            swcPlugin(),
        ],
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
            ...(process.env.SURPRESS_ERRORS !== "true" ? [checker({ typescript: true })] : []),
        ],
    },
});
