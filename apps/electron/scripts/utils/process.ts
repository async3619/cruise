import path from "path";
import { execSync, spawn } from "child_process";

function isSourceMapSupportInstalled(): boolean {
    try {
        require.resolve("source-map-support");
        return true;
    } catch {
        return false;
    }
}

export function spawnProcess(port: number) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const electronPath = require("electron") as unknown as string;
    const args = ["--log-level=3", "."];

    if (isSourceMapSupportInstalled()) {
        args.unshift("-r", "source-map-support/register");
    }

    return spawn(electronPath, args, {
        stdio: "inherit",
        shell: true,
        cwd: path.join(process.cwd(), "..", "main"),
        env: {
            ...process.env,
            NODE_ENV: "development",
            ELECTRON_RENDERER_URL: `http://localhost:${port}`,
        },
    });
}

export function treeKillSync(pid: number, signal?: string | number): void {
    if (process.platform === "win32") {
        execSync("taskkill /pid " + pid + " /T /F");
        return;
    }

    const childs = getAllChilds(pid);
    childs.forEach(function (pid) {
        killPid(pid, signal);
    });

    killPid(pid, signal);
    return;
}

function getAllPid(): {
    pid: number;
    ppid: number;
}[] {
    const rows = execSync("ps -A -o pid,ppid").toString().trim().split("\n").slice(1);

    return rows
        .map(function (row) {
            const parts = row.match(/\s*(\d+)\s*(\d+)/);

            if (parts === null) {
                return null;
            }

            return {
                pid: Number(parts[1]),
                ppid: Number(parts[2]),
            };
        })
        .filter(<T>(input: null | undefined | T): input is T => {
            return input != null;
        });
}

function getAllChilds(pid: number) {
    const allpid = getAllPid();

    const ppidHash: {
        [key: number]: number[];
    } = {};

    const result: number[] = [];

    allpid.forEach(function (item) {
        ppidHash[item.ppid] = ppidHash[item.ppid] || [];
        ppidHash[item.ppid].push(item.pid);
    });

    const find = function (pid: number) {
        ppidHash[pid] = ppidHash[pid] || [];
        ppidHash[pid].forEach(function (childPid) {
            result.push(childPid);
            find(childPid);
        });
    };

    find(pid);
    return result;
}

function killPid(pid: number, signal?: string | number) {
    try {
        process.kill(pid, signal);
    } catch (err) {
        if ((err as any).code !== "ESRCH") {
            throw err;
        }
    }
}
