import { z } from "zod";
import * as fs from "fs-extra";

import * as mgr from "@async3619/merry-go-round";

import { Injectable } from "@nestjs/common";

import { CONFIG_FILE_DIR, CONFIG_FILE_PATH } from "@main/constants";
import { Config, ConfigInput } from "@main/config/models/config.dto";

export const CONFIG_SCHEMA = z.object({
    libraryDirectories: z.array(z.string()),
});

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
        appTheme: "System",
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

    public async setConfig(config: ConfigInput) {
        assertConfig(config);
        await fs.writeJson(CONFIG_FILE_PATH, config, { spaces: 4 });
    }
}
