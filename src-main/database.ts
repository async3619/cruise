import * as path from "path";
import * as fs from "fs-extra";
import { DataSource } from "typeorm";

import { DATABASE_PATH } from "@main/constants";

import { Album } from "@main/album/models/album.model";
import { Music } from "@main/music/models/music.model";
import { Artist } from "@main/artist/models/artist.model";
import { AlbumArt } from "@main/album-art/models/album-art.model";

export async function initializeDatabase() {
    await fs.ensureDir(path.dirname(DATABASE_PATH));

    const dataSource = new DataSource({
        type: "sqlite",
        database: DATABASE_PATH,
        entities: [Album, Music, Artist, AlbumArt],
        synchronize: true,
        dropSchema: true,
    });

    await dataSource.initialize();

    return dataSource;
}
