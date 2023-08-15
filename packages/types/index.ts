import type { IpcRenderer } from "electron";

export type Nullable<T> = T | null | undefined;
export type Fn<TArgs = void, TReturn = void> = TArgs extends void
    ? () => TReturn
    : TArgs extends any[]
    ? (...args: TArgs) => TReturn
    : (args: TArgs) => TReturn;
export type AsyncFn<TArgs = void, TReturn = void> = Fn<TArgs, Promise<TReturn>>;

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

export type PickFn<T> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};
