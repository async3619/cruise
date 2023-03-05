import { ApolloLink, Operation } from "@apollo/client/core";
import { GraphQLSchema } from "graphql";
import { IpcMain } from "electron";

export interface GraphQLContext {}

export interface SchemaLinkOptions<TRoot = any> {
    schema: GraphQLSchema;
    root?: TRoot;
    context(request: Operation): GraphQLContext;
}

export interface IpcExecutorOptions {
    link: ApolloLink;
    ipc: IpcMain;
    channel?: string;
}

export interface SerializableGraphQLRequest<TContext = any, TVariables = any, TExtensions = any> {
    query: string;
    operationName?: string;
    variables?: TVariables;
    context?: TContext;
    extensions?: TExtensions;
}
