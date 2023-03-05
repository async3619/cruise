import type { IpcRenderer } from "electron";

export interface ApolloIpcLinkOptions<TContext = any> {
    channel?: string;
    ipc: IpcRenderer;
    contextSerializer?: (context: TContext) => any;
}

export interface SerializableGraphQLRequest<TContext = any, TVariables = any, TExtensions = any> {
    query: string;
    operationName?: string;
    variables?: TVariables;
    context?: TContext;
    extensions?: TExtensions;
}
