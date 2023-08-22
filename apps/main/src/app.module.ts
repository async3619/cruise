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

import { createGraphQLContext } from "@root/context";

@Module({
    imports: [
        GraphQLModule.forRootAsync<ElectronApolloDriverConfig>({
            imports: [],
            inject: [],
            driver: ElectronApolloDriver,
            useFactory: () => ({
                installSubscriptionHandlers: true,
                autoSchemaFile:
                    process.env.NODE_ENV === "production"
                        ? true
                        : path.join(process.cwd(), "..", "..", "schema.graphql"),
                context: window => createGraphQLContext(window),
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
    ],
})
export class AppModule {}
