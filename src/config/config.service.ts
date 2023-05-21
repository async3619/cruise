import { z } from "zod";
import * as fs from "fs-extra";

import * as mgr from "@async3619/merry-go-round";

import { Injectable } from "@nestjs/common";

import { AppTheme } from "@main/config/models/config.dto";

import { CONFIG_FILE_DIR, CONFIG_FILE_PATH } from "@main/constants";
import type { AsyncFn, Fn } from "@common/types";

export const CONFIG_SCHEMA = z.object({
    libraryDirectories: z.array(z.string()),
    appTheme: z.nativeEnum(AppTheme),
    lastPosition: z
        .object({
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number(),
        })
        .optional(),
});

type Config = z.infer<typeof CONFIG_SCHEMA>;

export function isConfig(value: unknown): value is Config {
    return CONFIG_SCHEMA.safeParse(value).success;
}

export function assertConfig(value: unknown): Config {
    return CONFIG_SCHEMA.parse(value);
}

const DEFAULT_CONFIG: Config = (() => {
    const libraryDirectories: string[] = [];
    const musicsDir = mgr.getMusicsPath();
    if (musicsDir) {
        libraryDirectories.push(musicsDir);
    }

    return {
        libraryDirectories,
        appTheme: AppTheme.System,
    };
})();

@Injectable()
export class ConfigService {
    public async getConfig(): Promise<Config> {
        const existing = fs.existsSync(CONFIG_FILE_PATH);
        if (!existing) {
            await fs.ensureDir(CONFIG_FILE_DIR);
            await fs.writeJson(CONFIG_FILE_PATH, DEFAULT_CONFIG, { spaces: 4 });
        }

        const data = await fs.readFile(CONFIG_FILE_PATH, "utf8");
        const config = JSON.parse(data);
        if (!isConfig(config)) {
            await fs.unlink(CONFIG_FILE_PATH);
            await this.setConfig(DEFAULT_CONFIG);

            return DEFAULT_CONFIG;
        }

        return config;
    }

    public async setConfig(config: Config | AsyncFn<Config, Config> | Fn<Config, Config>) {
        if (typeof config === "function") {
            config = await config(await this.getConfig());
        }

        assertConfig(config);
        await fs.writeJson(CONFIG_FILE_PATH, config, { spaces: 4 });
    }
}
