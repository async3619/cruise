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
import { PlaylistModule } from "@playlist/playlist.module";

import { AlbumService } from "@album/album.service";
import { AlbumArtService } from "@album-art/album-art.service";
import { ArtistService } from "@artist/artist.service";
import { ImageService } from "@image/image.service";
import { MusicService } from "@music/music.service";

import { createGraphQLContext } from "@root/context";

@Module({
    imports: [
        GraphQLModule.forRootAsync<ElectronApolloDriverConfig>({
            imports: [AlbumModule, AlbumArtModule, ArtistModule, ImageModule, MusicModule],
            inject: [AlbumService, AlbumArtService, ArtistService, ImageService, MusicService],
            driver: ElectronApolloDriver,
            useFactory: (
                albumService: AlbumService,
                albumArtService: AlbumArtService,
                artistService: ArtistService,
                imageService: ImageService,
                musicService: MusicService,
            ) => ({
                installSubscriptionHandlers: true,
                autoSchemaFile:
                    process.env.NODE_ENV === "production"
                        ? true
                        : path.join(process.cwd(), "..", "..", "schema.graphql"),
                context: window => {
                    return createGraphQLContext(
                        window,
                        albumService,
                        albumArtService,
                        artistService,
                        imageService,
                        musicService,
                    );
                },
            }),
        }),
        TypeOrmModule.forRoot({
            type: "better-sqlite3",
            database: path.join(os.homedir(), ".cruise", "database.sqlite"),
            entities: getMetadataArgsStorage().tables.map(t => t.target),
            autoLoadEntities: true,
            synchronize: true,
            dropSchema: false,
        }),
        ElectronModule,
        ConfigModule,
        LibraryModule,
        MusicModule,
        AlbumModule,
        ArtistModule,
        ImageModule,
        AlbumArtModule,
        PlaylistModule,
    ],
})
export class AppModule {}
