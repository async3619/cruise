import { ApolloLink, Observable, Operation, FetchResult } from "@apollo/client/core";
import type { IpcRenderer, IpcRendererEvent } from "electron";
import { print } from "graphql";
import { deserializeError } from "serialize-error";

import { ApolloIpcLinkOptions, SerializableGraphQLRequest } from "./types";

export class IpcLink extends ApolloLink {
    private readonly channel: string = "graphql";
    private readonly contextSerializer?: (context: any) => any = undefined;
    private readonly ipc: IpcRenderer;

    private observers = new Map<string, ZenObservable.SubscriptionObserver<FetchResult>>();

    private counter = 0;

    constructor(options: ApolloIpcLinkOptions) {
        super();

        this.ipc = options.ipc;
        if (typeof options.channel !== "undefined") {
            this.channel = options.channel;
        }

        if (typeof options.contextSerializer !== "undefined") {
            this.contextSerializer = options.contextSerializer;
        }

        this.ipc.on(this.channel, this.listener);
    }

    public request(operation: Operation) {
        return new Observable((observer: ZenObservable.SubscriptionObserver<FetchResult>) => {
            const current = `${++this.counter}`;
            const request: SerializableGraphQLRequest = {
                operationName: operation.operationName,
                variables: operation.variables,
                query: print(operation.query),
                context: this.contextSerializer?.(operation.getContext()),
            };

            this.observers.set(current, observer);
            this.ipc.send(this.channel, current, request);
        });
    }

    protected listener = (_: IpcRendererEvent, id: string, type: string, data: Record<string, any>) => {
        if (!this.observers.has(id)) {
            console.error(`Missing observer for query id ${id}.`);
        }

        const observer = this.observers.get(id);
        switch (type) {
            case "data":
                return observer && observer.next(data);

            case "error": {
                this.observers.delete(id);
                return observer && observer.error(deserializeError(data));
            }

            case "complete": {
                this.observers.delete(id);
                return observer && observer.complete();
            }
        }
    };

    public dispose() {
        this.ipc.removeListener(this.channel, this.listener);
    }
}

export const createIpcLink = (options: ApolloIpcLinkOptions) => {
    return new IpcLink(options);
};
