import chalk from "chalk";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    let colorFunction: (message: string) => string;
    switch (level) {
        case "error":
            level = "errr";
            colorFunction = chalk.red;
            break;

        case "warn":
            colorFunction = chalk.yellow;
            break;

        case "debug":
            level = "dbug";
            colorFunction = chalk.cyan;
            break;

        default:
            colorFunction = chalk.green;
            break;
    }

    const prefixTokens = [timestamp, level.padEnd(4, " ").toUpperCase()]
        .map(token => colorFunction(`[${token}]`))
        .join("");

    return `${prefixTokens} ${message}`;
});

export const logger = createLogger({
    format: combine(
        timestamp({
            format: "HH:mm:ss.SSS",
        }),
        myFormat,
    ),
    transports: [new transports.Console()],
});
