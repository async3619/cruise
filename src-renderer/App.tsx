import React from "react";
import { HashRouter } from "react-router-dom";
import type { ipcRenderer } from "electron";
import { ipcLink } from "electron-trpc/renderer";

import { QueryClient } from "@tanstack/react-query";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ApolloLink } from "@apollo/client/core";
import { createIpcLink } from "@graphql/ipc-link";

import { ThemeProvider } from "@mui/material";

import DialogProvider from "@dialogs/Provider";
import PlayerProvider from "@player/PlayerProvider";

import { mainTheme } from "@styles/theme";

import Router from "@renderer/Router";
import { trpcReact } from "@renderer/api";

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
    const [queryClient] = React.useState(() => new QueryClient());
    const [trpcClient] = React.useState(() =>
        trpcReact.createClient({
            links: [ipcLink()],
        }),
    );

    return (
        <ApolloProvider client={apolloClient}>
            <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
                <ThemeProvider theme={mainTheme}>
                    <PlayerProvider>
                        <DialogProvider>
                            <HashRouter>
                                <Router />
                            </HashRouter>
                        </DialogProvider>
                    </PlayerProvider>
                </ThemeProvider>
            </trpcReact.Provider>
        </ApolloProvider>
    );
}
