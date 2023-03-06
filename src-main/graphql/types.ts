import { GraphQLSchema } from "graphql";
import { BrowserWindow, IpcMain } from "electron";
import DataLoader from "dataloader";

import { ApolloLink, Operation } from "@apollo/client/core";

import { Artist } from "@main/artist/models/artist.model";
import { Album } from "@main/album/models/album.model";
import { Music } from "@main/music/models/music.model";

export interface GraphQLContext {
    window: BrowserWindow;
    artistLoader: DataLoader<number, Artist>;
    musicLoader: DataLoader<number, Music>;
    albumLoader: DataLoader<number, Album>;
}

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
