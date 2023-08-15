import chalk from "chalk";
import { logger } from "../utils/logger";

interface HandlerTypes {
    start: () => void;
    failed: (errors: string[]) => void;
    success: () => void;
    typeCheckStart: () => void;
    typeCheckResult: (errors: string[]) => void;
}

type HandlerMap = {
    [K in keyof HandlerTypes]: HandlerTypes[K][];
};

export abstract class BaseCompiler {
    private readonly token: string;
    private readonly handlers: HandlerMap = {
        start: [],
        failed: [],
        success: [],
        typeCheckStart: [],
        typeCheckResult: [],
    };

    protected constructor(name: string | undefined) {
        this.token = chalk.green(name ?? "unknown");
        let lastStartTime = Date.now();

        this.on("start", () => {
            lastStartTime = Date.now();
            logger.info(`start to compile '${this.token}' ...`);
        });

        this.on("success", () => {
            const time = Date.now() - lastStartTime;
            logger.info(`succeeded to compile '${this.token}'. ${chalk.gray(`(${time}ms)`)}`);
        });

        this.on("failed", errors => {
            logger.error(`failed to compile '${this.token}' with ${chalk.red(errors.length)} errors.`);

            console.log();
            for (const error of errors) {
                console.log(error);
            }
        });

        this.on("typeCheckStart", () => {
            logger.info(`start to type check '${this.token}' ...`);
        });

        this.on("typeCheckResult", errors => {
            if (errors.length === 0) {
                logger.info(`succeeded to type check '${this.token}' with no errors.`);
            } else {
                logger.error(`failed to type check '${this.token}' with ${chalk.red(errors.length)} errors.`);
                console.log();

                for (const error of errors) {
                    console.log(error);
                }
            }
        });
    }

    public on<K extends keyof HandlerTypes>(event: K, handler: HandlerTypes[K]) {
        this.handlers[event].unshift(handler);
    }
    public emit<K extends keyof HandlerTypes>(event: K, ...args: Parameters<HandlerTypes[K]>) {
        for (const handler of this.handlers[event]) {
            handler(...(args as [any]));
        }
    }

    public abstract start(): Promise<void>;
    public abstract isStarted(): boolean;

    public abstract run(): Promise<boolean>;
}
