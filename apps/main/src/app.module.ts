import os from "os";
import * as path from "path";
import { getMetadataArgsStorage } from "typeorm";

import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ElectronApolloDriver, ElectronApolloDriverConfig } from "@nest/electron-apollo.driver";

import { ElectronModule } from "@electron/electron.module";
import { ConfigModule } from "@config/config.module";
import { LibraryModule } from "@library/library.module";
import { MusicModule } from "@music/music.module";
import { AlbumModule } from "@album/album.module";
import { ArtistModule } from "@artist/artist.module";
import { ImageModule } from "@image/image.module";
import { AlbumArtModule } from "@album-art/album-art.module";

import { AlbumService } from "@album/album.service";
import { AlbumArtService } from "@album-art/album-art.service";
import { ArtistService } from "@artist/artist.service";
import { ImageService } from "@image/image.service";

import { createGraphQLContext } from "@root/context";

@Module({
    imports: [
        GraphQLModule.forRootAsync<ElectronApolloDriverConfig>({
            imports: [AlbumModule, AlbumArtModule, ArtistModule, ImageModule],
            inject: [AlbumService, AlbumArtService, ArtistService, ImageService],
            driver: ElectronApolloDriver,
            useFactory: (
                albumService: AlbumService,
                albumArtService: AlbumArtService,
                artistService: ArtistService,
                imageService: ImageService,
            ) => ({
                installSubscriptionHandlers: true,
                autoSchemaFile:
                    process.env.NODE_ENV === "production"
                        ? true
                        : path.join(process.cwd(), "..", "..", "schema.graphql"),
                context: window =>
                    createGraphQLContext(window, albumService, albumArtService, artistService, imageService),
            }),
        }),
        TypeOrmModule.forRoot({
            type: "better-sqlite3",
            database: path.join(os.homedir(), ".cruise", "database.sqlite"),
            entities: getMetadataArgsStorage().tables.map(t => t.target),
            autoLoadEntities: true,
            synchronize: true,
            dropSchema: true,
        }),
        ElectronModule,
        ConfigModule,
        LibraryModule,
        MusicModule,
        AlbumModule,
        ArtistModule,
        ImageModule,
        AlbumArtModule,
    ],
})
export class AppModule {}
