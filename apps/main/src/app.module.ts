import * as path from "path";

import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { ElectronApolloDriver, ElectronApolloDriverConfig } from "@nest/electron-apollo.driver";

import { ElectronModule } from "@electron/electron.module";

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
        ElectronModule,
    ],
})
export class AppModule {}
