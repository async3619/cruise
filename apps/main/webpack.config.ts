import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import TsconfigPathsPlugins from "tsconfig-paths-webpack-plugin";

import { dependencies as externals } from "./package.json";

const SRC_PATH = path.join(process.cwd(), "src");
const DIST_PATH = path.join(process.cwd(), "dist");

const configuration: webpack.Configuration = {
    devtool: "source-map",
    mode: "production",
    target: "electron-main",

    entry: {
        main: path.join(SRC_PATH, "main.ts"),
        preload: path.join(SRC_PATH, "preload.ts"),
    },

    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
        modules: [SRC_PATH, "node_modules"],
        // There is no need to add aliases here, the paths in tsconfig get mirrored
        plugins: [new TsconfigPathsPlugins()],
    },

    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        // Remove this line to enable type checking in webpack builds
                        transpileOnly: true,
                        compilerOptions: {
                            module: "esnext",
                        },
                    },
                },
            },
        ],
    },

    output: {
        path: DIST_PATH,
        filename: "[name].js",
        library: {
            type: "umd",
        },
    },

    optimization: {
        minimizer: [new TerserPlugin({ parallel: true })],
    },

    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled",
            analyzerPort: 8888,
        }),

        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behaviour between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         */
        new webpack.EnvironmentPlugin({
            NODE_ENV: "production",
            DEBUG_PROD: false,
            START_MINIMIZED: false,
        }),

        new webpack.DefinePlugin({
            "process.type": '"browser"',
        }),
    ],

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false,
    },

    stats: "errors-only",
    externals: [...Object.keys(externals || {})],
};

export default configuration;
