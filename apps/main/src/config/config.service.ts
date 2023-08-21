import { z } from "zod";
import os from "os";
import path from "path";
import fs from "fs-extra";

import { Injectable } from "@nestjs/common";

const CONFIG_FILE_PATH = path.join(os.homedir(), ".cruise", "config.json");
const CONFIG_SCHEMA = z.object({
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

type ConfigType = z.infer<typeof CONFIG_SCHEMA>;

const DEFAULT_CONFIG: ConfigType = {};

@Injectable()
export class ConfigService {
    private readonly fs = fs;

    public async getConfig(): Promise<ConfigType> {
        try {
            const data = await this.fs.readFile(CONFIG_FILE_PATH, "utf-8");
            return CONFIG_SCHEMA.parse(JSON.parse(data));
        } catch (error) {
            return CONFIG_SCHEMA.parse(DEFAULT_CONFIG);
        }
    }

    public async setConfig(config: Partial<ConfigType>) {
        const newConfig = {
            ...(await this.getConfig()),
            ...config,
        };

        await this.fs.ensureDir(path.dirname(CONFIG_FILE_PATH));
        await this.fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(newConfig));
    }
}
