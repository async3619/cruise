import * as path from "path";
import * as fs from "fs-extra";
import { DataSource } from "typeorm";

import { DATABASE_PATH } from "@main/constants";

export async function initializeDatabase() {
    await fs.ensureDir(path.dirname(DATABASE_PATH));

    const dataSource = new DataSource({
        type: "sqlite",
        database: DATABASE_PATH,
        entities: ["./dist-main/**/*.model.js"],
        dropSchema: true,
        synchronize: true,
    });

    await dataSource.initialize();

    return dataSource;
}
