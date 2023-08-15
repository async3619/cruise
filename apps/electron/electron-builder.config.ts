import { Configuration } from "electron-builder";

const config: Configuration = {
    directories: {
        output: "packages",
        app: "dist",
    },

    npmArgs: ["--ignore-workspace"],
    npmRebuild: true,
};

export default config;
