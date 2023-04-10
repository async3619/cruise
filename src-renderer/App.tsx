import React from "react";
import { HashRouter } from "react-router-dom";
import type { ipcRenderer } from "electron";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

import { ThemeProvider } from "@mui/material";

import DialogProvider from "@dialogs/Provider";
import PlayerProvider from "@player/PlayerProvider";
import LibraryProvider from "@library/Provider";

import Router from "@renderer/Router";

import { mainTheme } from "@styles/theme";
import { haunted } from "@utils/haunted";

declare global {
    interface Window {
        ipcRenderer: typeof ipcRenderer;
    }
}

export default function App() {
    const [queryClient] = React.useState(() => new QueryClient());
    const [trpcClient] = React.useState(() =>
        haunted.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:3000/trpc",
                }),
            ],
        }),
    );

    return (
        <haunted.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
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
            </QueryClientProvider>
        </haunted.Provider>
    );
}
