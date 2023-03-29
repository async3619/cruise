import React from "react";
import { HashRouter } from "react-router-dom";
import type { ipcRenderer } from "electron";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

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
