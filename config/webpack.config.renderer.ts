import path from "path";
import webpack from "webpack";
import TsconfigPathsPlugins from "tsconfig-paths-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export const getRootUrl = (port: number) => `http://localhost:${port}/`;

const rendererConfig: (dev: boolean, analyze: boolean, port: number) => webpack.Configuration = (
    dev,
    analyze,
    port,
) => ({
    name: "renderer",

    target: ["web", "electron-renderer"],
    mode: !dev ? "production" : "development",
    devtool: !dev ? "source-map" : "inline-source-map",

    entry: [
        ...(dev ? [`webpack-dev-server/client?${getRootUrl(port)}`, "webpack/hot/only-dev-server"] : []),
        path.join(process.cwd(), "src-renderer", "index"),
    ],

    output: {
        path: path.join(process.cwd(), "out", "renderer"),
        publicPath: "/",
        filename: !dev ? "renderer.js" : "renderer.dev.js",
        library: {
            type: "window",
        },
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: {
                    // `.swcrc` can be used to configure swc
                    loader: "swc-loader",
                    options: {
                        minify: !dev,
                        jsc: {
                            minify: !dev
                                ? {
                                      mangle: true,
                                      compress: {
                                          unused: true,
                                      },
                                  }
                                : undefined,
                            parser: {
                                syntax: "typescript",
                                tsx: true,
                                decorators: true,
                            },
                            loose: true,
                            transform: {
                                legacyDecorator: true,
                                decoratorMetadata: true,
                                react: {
                                    runtime: "automatic",
                                    refresh: true,
                                },
                            },
                            experimental: {
                                plugins: [
                                    [
                                        "@swc/plugin-emotion",
                                        {
                                            autoLabel: dev ? "never" : "always",
                                            sourceMap: dev,
                                            labelFormat: "[local]",
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                },
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "@svgr/webpack",
                        options: {
                            prettier: false,
                            svgo: false,
                            svgoConfig: {
                                plugins: [{ removeViewBox: false }],
                            },
                            titleProp: true,
                            ref: true,
                        },
                    },
                ],
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [new TsconfigPathsPlugins()],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: path.join("index.html"),
            template: path.join(process.cwd(), "index.html"),
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true,
            },
            isBrowser: false,
            env: process.env.NODE_ENV,
            isDevelopment: process.env.NODE_ENV !== "production",
            nodeModules: path.join(process.cwd(), "node_modules"),
            publicPath: dev ? "/" : "./",
        }),

        new ForkTsCheckerWebpackPlugin({
            logger: "webpack-infrastructure",
            typescript: {
                configFile: path.join(process.cwd(), "config", "tsconfig.renderer.json"),
            },
        }),

        ...(dev ? [new ReactRefreshWebpackPlugin({ esModule: true, overlay: { sockProtocol: "ws" } })] : []),
        ...(analyze && !dev ? [new BundleAnalyzerPlugin({ analyzerMode: "static" })] : []),
    ],

    node: {
        __dirname: false,
        __filename: false,
    },

    infrastructureLogging: {
        level: "none",
    },

    stats: false,

    watchOptions: {
        ignored: /node_modules/,
    },
});

export default rendererConfig;
