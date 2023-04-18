import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { DocumentNode, ExecutionArgs, ExecutionResult, parse, subscribe } from "graphql";
import { createAsyncIterator, forAwaitEach, isAsyncIterable } from "iterall";

import { Injectable, Logger } from "@nestjs/common";
import { ApolloBaseDriver } from "@nestjs/apollo/dist/drivers/apollo-base.driver";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { is } from "@electron-toolkit/utils";

import { ApolloServer } from "@apollo/server";
import { getMainDefinition } from "@apollo/client/utilities";
import {
    ExecutionPatchIncrementalResult,
    ExecutionPatchInitialResult,
    Observable,
    SingleExecutionResult,
} from "@apollo/client/core";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";

import { GraphQLContext } from "@main/context";

import type { SerializableGraphQLRequest } from "@common/types";
import { FetchResult } from "@apollo/client";

export interface ElectronApolloDriverConfig extends ApolloDriverConfig {
    context(window: BrowserWindow | null): Promise<GraphQLContext>;
}

function isSubscription(query: DocumentNode) {
    const main = getMainDefinition(query);
    return main.kind === "OperationDefinition" && main.operation === "subscription";
}

function ensureIterable(data: ExecutionResult | AsyncIterableIterator<ExecutionResult>) {
    if (isAsyncIterable(data)) {
        return data;
    }

    return createAsyncIterator([data]);
}

@Injectable()
export class ElectronApolloDriver extends ApolloBaseDriver {
    private readonly logger = new Logger(ElectronApolloDriver.name);

    public constructor() {
        super();

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        super["wrapContextResolver"] = () => {};
    }

    private async handleRequest(
        e: IpcMainEvent,
        id: string,
        data: SerializableGraphQLRequest,
        options: ElectronApolloDriverConfig,
        window: BrowserWindow | null,
    ) {
        const schema = options.schema;
        if (!schema) {
            throw new Error("Apollo schema is not defined");
        }

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
            e.sender.send("graphql", id, "data", result.body.singleResult);
            e.sender.send("graphql", id, "complete");
        }
    }
    private async handleSubscription(
        e: IpcMainEvent,
        id: string,
        data: SerializableGraphQLRequest,
        options: ElectronApolloDriverConfig,
        window: BrowserWindow | null,
    ) {
        const handleRequest = async (
            observer: ZenObservable.SubscriptionObserver<
                | SingleExecutionResult<Record<string, any>, Record<string, any>>
                | ExecutionPatchInitialResult
                | ExecutionPatchIncrementalResult
            >,
        ) => {
            const schema = options.schema;
            if (!schema) {
                throw new Error("Apollo schema is not defined");
            }

            const document = parse(data.query);
            const args: ExecutionArgs = {
                schema,
                rootValue: options.rootValue,
                contextValue: await options.context(window),
                variableValues: data.variables,
                operationName: data.operationName,
                document,
            };

            const result = await subscribe(args);
            const iterable = ensureIterable(result) as any as AsyncIterable<any>;
            await forAwaitEach(iterable, (value: any) => observer.next(value));
        };

        const observable = new Observable<FetchResult>(observer => {
            handleRequest(observer);
        });

        const sendIpc = (type: string, data?: any) => {
            if (e.sender.isDestroyed()) {
                return;
            }

            e.sender.send("graphql", id, type, data);
        };

        return observable.subscribe(
            data => sendIpc("data", data),
            error => sendIpc("error", error),
            () => sendIpc("complete"),
        );
    }

    public async start(options: ElectronApolloDriverConfig) {
        const schema = options.schema;
        if (!schema) {
            throw new Error("Apollo schema is not defined");
        }

        this.apolloServer = new ApolloServer({
            schema: schema,
            introspection: true,
            plugins: is.dev ? [ApolloServerPluginLandingPageGraphQLPlayground()] : [],
        });

        ipcMain.on("graphql", async (event, id: string, data: SerializableGraphQLRequest) => {
            const window = BrowserWindow.fromWebContents(event.sender);
            const query = parse(data.query);
            if (!isSubscription(query)) {
                await this.handleRequest(event, id, data, options, window);
            } else {
                await this.handleSubscription(event, id, data, options, window);
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
