import { BrowserWindow, ipcMain } from "electron";

import { Injectable, Logger } from "@nestjs/common";
import { ApolloBaseDriver } from "@nestjs/apollo/dist/drivers/apollo-base.driver";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { is } from "@electron-toolkit/utils";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";

import { GraphQLContext } from "@main/context";

import { SerializableGraphQLRequest } from "@common/types";

export interface ElectronApolloDriverConfig extends ApolloDriverConfig {
    context(window: BrowserWindow | null): Promise<GraphQLContext>;
}

@Injectable()
export class ElectronApolloDriver extends ApolloBaseDriver {
    private readonly logger = new Logger(ElectronApolloDriver.name);

    public constructor() {
        super();

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        super["wrapContextResolver"] = () => {};
    }

    public async start(options: ElectronApolloDriverConfig) {
        if (!options.schema) {
            throw new Error("Apollo schema is not defined");
        }

        this.apolloServer = new ApolloServer({
            schema: options.schema,
            introspection: true,
            plugins: is.dev ? [ApolloServerPluginLandingPageGraphQLPlayground()] : [],
        });

        ipcMain.on("graphql", async (event, id: string, data: SerializableGraphQLRequest) => {
            const window = BrowserWindow.fromWebContents(event.sender);
            const result = await this.apolloServer.executeOperation(
                {
                    query: data.query,
                    operationName: data.operationName,
                    variables: data.variables,
                    extensions: data.extensions,
                },
                {
                    contextValue: await options.context(window),
                },
            );

            if (result.body.kind === "single") {
                event.sender.send("graphql", id, "data", result.body.singleResult);
            }
        });

        if (is.dev) {
            await startStandaloneServer(this.apolloServer, {
                listen: {
                    port: 4000,
                },
                context: () => options.context(null),
            });

            this.logger.log("GraphQL server started at http://localhost:4000/graphql");
        } else {
            await this.apolloServer.start();
        }
    }
    public async stop() {
        if (this.apolloServer) {
            await this.apolloServer.stop();
        }

        ipcMain.removeAllListeners("graphql");
    }
}
