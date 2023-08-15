import * as path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = path.join(PACKAGE_ROOT, "../..");

export default defineConfig({
    root: PACKAGE_ROOT,
    envDir: PROJECT_ROOT,
    plugins: [react(), tsconfigPaths()],
    base: "",
    build: {
        sourcemap: true,
        outDir: "dist",
        assetsDir: ".",
        rollupOptions: {
            input: path.join(PACKAGE_ROOT, "index.html"),
        },
        emptyOutDir: true,
        reportCompressedSize: false,
    },
});
