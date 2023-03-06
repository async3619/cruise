import { createAsyncIterator, forAwaitEach, isAsyncIterable } from "iterall";
import { parse, execute, subscribe, ExecutionArgs, DocumentNode, ExecutionResult } from "graphql";
import { serializeError } from "serialize-error";
import { IpcMainEvent } from "electron";

import { ApolloLink, FetchResult, Observable, execute as executeLink, Operation } from "@apollo/client/core";
import { getMainDefinition } from "@apollo/client/utilities";

import { SerializableGraphQLRequest, SchemaLinkOptions, IpcExecutorOptions } from "./types";

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

export function createSchemaLink(options: SchemaLinkOptions) {
    const handleRequest = async (request: Operation, observer: any) => {
        try {
            const context = options.context && (await options.context(request));
            const args: ExecutionArgs = {
                schema: options.schema,
                rootValue: options.root,
                contextValue: context,
                variableValues: request.variables,
                operationName: request.operationName,
                document: request.query,
            };

            const result = await (isSubscription(request.query) ? subscribe(args) : execute(args));
            if ("errors" in result && Array.isArray(result.errors) && result.errors.length > 0) {
                console.log(result.errors[0]);
            }

            const iterable = ensureIterable(result) as any as AsyncIterable<any>;
            await forAwaitEach(iterable, (value: any) => observer.next(value));
            observer.complete();
        } catch (error) {
            observer.error(error);
        }
    };

    const createObservable = (request: Operation) => {
        return new Observable<FetchResult>(observer => {
            handleRequest(request, observer);
        });
    };

    return new ApolloLink(request => createObservable(request));
}

export function createIpcExecutor(options: IpcExecutorOptions) {
    const channel = options.channel || "graphql";
    const listener = (event: IpcMainEvent, id: number, request: SerializableGraphQLRequest) => {
        const result: Observable<FetchResult> = executeLink(options.link, {
            ...request,
            query: parse(request.query),
        });

        const sendIpc = (type: string, data?: Record<string, any>) => {
            if (!event.sender.isDestroyed()) {
                event.sender.send(channel, id, type, data);
            }
        };

        return result.subscribe(
            data => sendIpc("data", data),
            error => sendIpc("error", serializeError(error)),
            () => sendIpc("complete"),
        );
    };

    options.ipc.on(channel, listener);

    return () => {
        options.ipc.removeListener(channel, listener as any);
    };
}
