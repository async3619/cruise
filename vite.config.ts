import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import electron from "vite-electron-plugin";
import { loadViteEnv } from "vite-electron-plugin/plugin";
import renderer from "vite-plugin-electron-renderer";
import { rmSync } from "fs";

const devServerUrl = "http://127.0.0.1:7777/";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    rmSync("dist-electron", { recursive: true, force: true });

    const sourcemap = command === "serve" || !!process.env.VSCODE_DEBUG;

    return {
        plugins: [
            react({
                plugins: [["@swc/plugin-emotion", {}]],
            }),
            tsconfigPaths(),
            electron({
                include: ["src-main"],
                transformOptions: {
                    sourcemap,
                },
                plugins: [loadViteEnv()],
                outDir: "dist-main",
            }),
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
