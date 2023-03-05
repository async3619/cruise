import { buildSchema, getMetadataStorage } from "type-graphql";
import * as path from "path";
import * as fs from "fs-extra";
import { Container } from "typedi";
import { DataSource } from "typeorm";

import MusicResolver from "@main/library/music/music.resolver";

import { DATABASE_PATH } from "@main/constants";

export async function initializeSchema(dataSource: DataSource) {
    for (const objectType of getMetadataStorage().objectTypes) {
        Container.set(objectType.target.name, dataSource.getRepository(objectType.target));
    }

    return await buildSchema({
        resolvers: [MusicResolver],
        container: Container,
    });
}

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
