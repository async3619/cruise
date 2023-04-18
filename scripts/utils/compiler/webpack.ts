import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

import { BaseCompiler } from "./base";

import { errorFormatter } from "../../../config/webpack.utils";

export class WebpackCompiler extends BaseCompiler {
    private readonly compiler: webpack.Compiler;
    private readonly config: webpack.Configuration;
    private devServer: WebpackDevServer | null = null;

    private watching = false;

    public constructor(config: webpack.Configuration);
    public constructor(config: (port: number) => webpack.Configuration, port: number);
    public constructor(
        config: webpack.Configuration | ((port: number) => webpack.Configuration),
        private readonly port?: number,
    ) {
        let newConfig = config;
        if (typeof newConfig === "function") {
            if (!port) {
                throw new Error("Port is required for webpack config function");
            }

            newConfig = newConfig(port);
        }

        super(newConfig.name);

        this.config = newConfig;
        this.compiler = webpack(this.config);
        const hooks = ForkTsCheckerWebpackPlugin.getCompilerHooks(this.compiler);

        hooks.waiting.tap("waiting", () => {
            this.emit("typeCheckStart");
        });

        hooks.issues.tap("issues", issues => {
            const formattedIssues = issues.map(errorFormatter);
            this.emit("typeCheckResult", formattedIssues);

            return issues;
        });

        this.compiler.hooks.thisCompilation.tap("thisCompilation", () => {
            this.emit("start");
        });

        this.compiler.hooks.afterDone.tap("afterDone", ({ compilation }) => {
            if (compilation.errors.length) {
                const errors = compilation.errors.map(error => error.message);

                this.emit("failed", errors);
            } else {
                this.emit("success");
            }
        });
    }

    public async start() {
        this.watching = true;

        const needDevServer =
            Array.isArray(this.config.entry) && this.config.entry.some(entry => entry.includes("webpack-dev-server"));

        if (!needDevServer) {
            this.compiler.watch({}, () => {
                return;
            });

            return;
        }

        this.devServer = new WebpackDevServer({ port: this.port }, this.compiler);
        await this.devServer.start();
    }
    public isStarted() {
        return this.watching;
    }

    public run() {
        return new Promise<boolean>(resolve => {
            this.on("typeCheckResult", errors => {
                if (errors.length > 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });

            this.compiler.run(() => {
                return;
            });
        });
    }

    public getPort() {
        return this.port;
    }
}
