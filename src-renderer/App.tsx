import React from "react";
import { HashRouter } from "react-router-dom";
import type { ipcRenderer } from "electron";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ApolloLink } from "@apollo/client/core";
import { createIpcLink } from "@graphql/ipc-link";

import { ThemeProvider } from "@mui/material";

import DialogProvider from "@dialogs/Provider";
import PlayerProvider from "@player/PlayerProvider";
import LibraryProvider from "@library/Provider";

import { mainTheme } from "@styles/theme";

import Router from "@renderer/Router";

declare global {
    interface Window {
        ipcRenderer: typeof ipcRenderer;
    }
}

const apolloClient = new ApolloClient({
    defaultOptions: {
        query: {
            fetchPolicy: "no-cache",
        },
        mutate: {
            fetchPolicy: "no-cache",
        },
        watchQuery: {
            fetchPolicy: "no-cache",
        },
    },
    cache: new InMemoryCache(),
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) =>
                    console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
                );
            if (networkError) console.error(`[Network error]: ${networkError}. Backend is unreachable. Is it running?`);
        }),
        createIpcLink({ ipc: window.ipcRenderer }),
    ]),
});

export default function App() {
    return (
        <ApolloProvider client={apolloClient}>
            <ThemeProvider theme={mainTheme}>
                <PlayerProvider>
                    <DialogProvider>
                        <LibraryProvider client={apolloClient}>
                            <HashRouter>
                                <Router />
                            </HashRouter>
                        </LibraryProvider>
                    </DialogProvider>
                </PlayerProvider>
            </ThemeProvider>
        </ApolloProvider>
    );
}
