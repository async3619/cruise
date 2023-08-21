import { z } from "zod";
import os from "os";
import path from "path";
import fs from "fs-extra";

import { Injectable } from "@nestjs/common";

import { ColorMode } from "@config/models/config.dto";

const CONFIG_FILE_PATH = path.join(os.homedir(), ".cruise", "config.json");
const CONFIG_SCHEMA = z.object({
    colorMode: z.nativeEnum(ColorMode),

    windowState: z
        .object({
            isMaximized: z.boolean(),
            width: z.number(),
            height: z.number(),
            x: z.number(),
            y: z.number(),
        })
        .optional(),
});

export type ConfigType = z.infer<typeof CONFIG_SCHEMA>;
export const DEFAULT_CONFIG: ConfigType = {
    colorMode: ColorMode.System,
};

@Injectable()
export class ConfigService {
    private readonly fs = fs;

    public async getConfig(rewrite = true): Promise<ConfigType> {
        try {
            const data = await this.fs.readFile(CONFIG_FILE_PATH, "utf-8");
            return CONFIG_SCHEMA.parse(JSON.parse(data));
        } catch (error) {
            if (rewrite) {
                await this.setConfig(DEFAULT_CONFIG);
            }

            return CONFIG_SCHEMA.parse(DEFAULT_CONFIG);
        }
    }

    public async setConfig(config: Partial<ConfigType>) {
        const newConfig = {
            ...(await this.getConfig(false)),
            ...config,
        };

        await this.fs.ensureDir(path.dirname(CONFIG_FILE_PATH));
        await this.fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(newConfig));
    }
}
