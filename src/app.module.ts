import { getMetadataArgsStorage } from "typeorm";
import * as fs from "fs-extra";
import * as path from "path";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";

import { ElectronApolloDriver, ElectronApolloDriverConfig } from "@main/nest/electron-apollo.driver";

import { LibraryModule } from "@main/library/library.module";
import { ElectronModule } from "@main/electron/electron.module";

import { MusicModule } from "@main/music/music.module";
import { MusicService } from "@main/music/music.service";

import { AlbumModule } from "@main/album/album.module";
import { AlbumService } from "@main/album/album.service";

import { ArtistModule } from "@main/artist/artist.module";
import { ArtistService } from "@main/artist/artist.service";

import { AlbumArtModule } from "@main/album-art/album-art.module";
import { AlbumArtService } from "@main/album-art/album-art.service";

import { ConfigModule } from "@main/config/config.module";

import { createGraphQLContext } from "@main/context";
import { SQLITE_DATABASE_DIR, SQLITE_DATABASE_PATH } from "@main/constants";

fs.ensureDirSync(SQLITE_DATABASE_DIR);

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: SQLITE_DATABASE_PATH,
            entities: getMetadataArgsStorage().tables.map(t => t.target),
            autoLoadEntities: true,
            dropSchema: true,
            synchronize: true,
        }),
        GraphQLModule.forRootAsync<ElectronApolloDriverConfig>({
            imports: [MusicModule, AlbumModule, ArtistModule, AlbumArtModule],
            inject: [MusicService, AlbumService, ArtistService, AlbumArtService],
            driver: ElectronApolloDriver,
            useFactory: (
                musicService: MusicService,
                albumService: AlbumService,
                artistService: ArtistService,
                albumArtService: AlbumArtService,
            ) => ({
                installSubscriptionHandlers: true,
                autoSchemaFile: path.join(process.cwd(), "schema.graphql"),
                context: window => {
                    return createGraphQLContext(window, musicService, albumService, artistService, albumArtService);
                },
            }),
        }),
        LibraryModule,
        MusicModule,
        AlbumModule,
        ArtistModule,
        AlbumArtModule,
        ElectronModule,
        ConfigModule,
    ],
})
export class AppModule {}
