import { z } from "zod";
import * as fs from "fs-extra";
import * as mgr from "@async3619/merry-go-round";

import { CONFIG_FILE_DIR, CONFIG_FILE_PATH } from "./constants";

export interface Config {
    libraryDirectories: string[];
    appTheme: "Light" | "Dark" | "System";
}

export const CONFIG_SCHEMA = z
    .object({
        libraryDirectories: z.array(z.string()),
        appTheme: z.enum(["Light", "Dark", "System"]),
    })
    .required();

const DEFAULT_CONFIG: Config = (() => {
    const libraryDirectories: string[] = [];
    const musicsDir = mgr.getMusicsPath();
    if (musicsDir) {
        libraryDirectories.push(musicsDir);
    }

    return {
        libraryDirectories,
        appTheme: "System",
    };
})();

export async function getConfig(): Promise<Config> {
    const existing = fs.existsSync(CONFIG_FILE_PATH);
    if (!existing) {
        await fs.ensureDir(CONFIG_FILE_DIR);
        await fs.writeJson(CONFIG_FILE_PATH, DEFAULT_CONFIG, { spaces: 4 });
    }

    const config: Config = {
        ...DEFAULT_CONFIG,
        ...(await fs.readJson(CONFIG_FILE_PATH)),
    };
    CONFIG_SCHEMA.parse(config);

    return config;
}

export function setConfig(config: Config): Promise<void> {
    CONFIG_SCHEMA.parse(config);

    return fs.writeJson(CONFIG_FILE_PATH, config, { spaces: 4 });
}
