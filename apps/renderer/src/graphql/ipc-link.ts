import { nanoid } from "nanoid";
import type { IpcRenderer, IpcRendererEvent } from "electron";
import { print } from "graphql";
import { deserializeError } from "serialize-error";

import { ApolloLink, FetchResult, Observable, Operation } from "@apollo/client/core";

import { ApolloIpcLinkOptions, SerializableGraphQLRequest } from "types";

export class IpcLink extends ApolloLink {
    private readonly channel: string = "graphql";
    private readonly contextSerializer?: (context: any) => any = undefined;
    private readonly ipc: IpcRenderer;

    private observers = new Map<string, ZenObservable.SubscriptionObserver<FetchResult>>();

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
            const id = nanoid();
            const request: SerializableGraphQLRequest = {
                operationName: operation.operationName,
                variables: operation.variables,
                query: print(operation.query),
                context: this.contextSerializer?.(operation.getContext()),
            };

            this.observers.set(id, observer);
            this.ipc.send(this.channel, id, request);
        });
    }

    protected listener = (_: IpcRendererEvent, id: string, type: string, data: Record<string, any>) => {
        const observer = this.observers.get(id);
        if (!observer) {
            // we should ignore when observer is not found since it would only happen in unusual cases
            // such as reloading the page or hot-reloading the renderer process
            return;
        }

        switch (type) {
            case "data":
                return observer.next(data);

            case "error": {
                this.observers.delete(id);
                return observer.error(deserializeError(data));
            }

            case "complete": {
                this.observers.delete(id);
                return observer.complete();
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
