import React from "react";
import { HashRouter } from "react-router-dom";
import type { ipcRenderer } from "electron";
import { ipcLink } from "electron-trpc/renderer";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { ThemeProvider } from "@mui/material";
import Router from "@components/Router";

import { QueryClient } from "@tanstack/react-query";

import { mainTheme } from "@styles/theme";

import { trpcReact } from "@/api";
import { createIpcLink } from "@/graphql/ipc-link";
import { ApolloLink } from "@apollo/client/core";

declare global {
    interface Window {
        ipcRenderer: typeof ipcRenderer;
    }
}

const apolloClient = new ApolloClient({
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
                    <HashRouter>
                        <Router />
                    </HashRouter>
                </ThemeProvider>
            </trpcReact.Provider>
        </ApolloProvider>
    );
}
