import * as ts from "typescript";
import * as tts from "ttypescript";
import chalk from "chalk";
import glob from "fast-glob";

import { codeFrameColumns } from "@babel/code-frame";

import { BaseCompiler } from "./base";
import path from "path";
import fs from "fs-extra";

const startCompilingCode = [6031, 6032];
const errorCompilingCode = [6194, 6193];

export function formatDiagnostic(diagnostic: ts.Diagnostic) {
    const originalMessage = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

    let message = `${chalk.red("error")} ${chalk.gray(`TS${diagnostic.code}:`)} ${originalMessage}`;
    if (diagnostic.file) {
        const tokens = [chalk.cyan(`${diagnostic.file.fileName}`)];
        if (diagnostic.start) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const endPosition = diagnostic.length
                ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start + diagnostic.length)
                : null;

            const frame = codeFrameColumns(
                diagnostic.file.text,
                {
                    start: { line: line + 1, column: character + 1 },
                    end: endPosition ? { line: endPosition.line + 1, column: endPosition.character + 1 } : undefined,
                },
                { highlightCode: true },
            );

            tokens.push(chalk.yellow(`${line + 1}`), chalk.yellow(`${character + 1}`));
            message += `\n${tokens.join(":")}\n\n${frame}\n`;
        } else {
            message += `\n${tokens.join(":")}\n`;
        }
    }

    return message;
}

export class TypescriptCompiler extends BaseCompiler {
    private program: ts.WatchOfConfigFile<ts.SemanticDiagnosticsBuilderProgram> | null = null;
    private host: ts.WatchCompilerHostOfConfigFile<ts.SemanticDiagnosticsBuilderProgram> | null = null;
    private readonly diagnostics: ts.Diagnostic[] = [];

    public constructor(name: string, private readonly configPath: string) {
        super(name);
    }

    public async start() {
        this.host = tts.createWatchCompilerHost(
            this.configPath,
            {},
            tts.sys,
            tts.createSemanticDiagnosticsBuilderProgram,
            this.handleDiagnostics.bind(this),
            this.handleWatchStatusChanged.bind(this),
        );

        this.program = tts.createWatchProgram(this.host);
    }
    public isStarted() {
        return !!this.program && !!this.host;
    }

    private flushDiagnostics() {
        const diagnostics = [...this.diagnostics];
        this.diagnostics.length = 0;

        return diagnostics;
    }

    private handleDiagnostics(diagnostic: ts.Diagnostic) {
        this.diagnostics.push(diagnostic);
    }
    private async handleWatchStatusChanged(
        diagnostic: ts.Diagnostic,
        newLine: string,
        options: ts.CompilerOptions,
        errorCount?: number,
    ) {
        // on start
        if (startCompilingCode.includes(diagnostic.code)) {
            this.emit("start");
        }

        // on error
        if (errorCompilingCode.includes(diagnostic.code) && errorCount) {
            const diagnostics = this.flushDiagnostics().map(formatDiagnostic);
            this.emit("failed", diagnostics);
        }

        // on success
        if (!errorCount && diagnostic.code === 6194) {
            await this.replacePaths(options);
            this.emit("success");
        }
    }

    private async replacePaths({ paths, outDir, baseUrl }: ts.CompilerOptions) {
        if (!paths) {
            return;
        }

        if (!outDir) {
            throw new Error("compilerOptions.outDir is not defined");
        }

        if (!baseUrl) {
            throw new Error("compilerOptions.baseUrl is not defined");
        }

        const sourcePaths = await glob(["**/*.{js,jsx}", "*.{js,jsx}"], {
            cwd: outDir,
        });

        const aliasPrefixes = Object.keys(paths);
        const getUsedPathAlias = (path: string) => {
            for (const prefix of aliasPrefixes) {
                const regex = new RegExp(`^${prefix.replace("*", "(.*)")}$`);
                const match = path.match(regex);

                if (match) {
                    return prefix;
                }
            }
        };

        const replacePathAlias = (path: string, prefix: string) => {
            const regex = new RegExp(`^${prefix.replace("*", "(.*)")}$`);
            return path.replace(regex, paths[prefix][0].replace("*", "$1"));
        };

        for (const sourcePath of sourcePaths) {
            const targetPath = path.join(outDir, sourcePath);
            const targetDirectoryPath = path.dirname(targetPath);

            let sourceCode = await fs.readFile(targetPath, "utf8");
            const tokens = sourceCode.matchAll(/(require\("(.*?)"\)|import "(.*?)"|from "(.*?)")/g);
            for (const [target, , requireFrom, importFrom, from] of tokens) {
                const fromPath = requireFrom || importFrom || from;
                if (!fromPath) {
                    continue;
                }

                const usedPathAlias = getUsedPathAlias(fromPath);
                if (!usedPathAlias) {
                    continue;
                }

                const replacedPath = replacePathAlias(fromPath, usedPathAlias);
                const compiledSourcePath = path.join(outDir, replacedPath);
                let relativePath = path.relative(targetDirectoryPath, compiledSourcePath);
                if (!relativePath.startsWith(".")) {
                    relativePath = `./${relativePath}`;
                }

                relativePath = relativePath.replace(/\\/g, "/");
                sourceCode = sourceCode.replace(target, target.replace(fromPath, relativePath));
            }

            await fs.writeFile(targetPath, sourceCode);
        }
    }
}
