import fs from "fs-extra";
import chalk from "chalk";

import { codeFrameColumns } from "@babel/code-frame";
import { Issue } from "fork-ts-checker-webpack-plugin/lib/issue";

interface ErrorInfo {
    code: number;
    severity: "error" | "warning";
    content: string;
    file: string;
    line: number;
    character: number;
}

export function errorFormatter(error: ErrorInfo | Issue) {
    const { file } = error;
    const content = "message" in error ? error.message : error.content;

    let message = `${chalk.red("error")} ${chalk.gray(`TS${error.code}:`)} ${content}`;
    if (file) {
        const tokens = [chalk.cyan(`${file}`)];
        let start: { line: number; column: number } | undefined;
        let end: { line: number; column: number } | undefined;
        if ("line" in error) {
            start = { line: error.line, column: error.character };
        } else if (error.location) {
            start = error.location.start;
            end = error.location.end;
        }

        if (start) {
            const frame = codeFrameColumns(fs.readFileSync(file).toString(), { start, end }, { highlightCode: true });

            tokens.push(chalk.yellow(`${start.line + 1}`), chalk.yellow(`${start.column + 1}`));
            message += `\n${tokens.join(":")}\n\n${frame}\n`;
        }
    }

    return message;
}
