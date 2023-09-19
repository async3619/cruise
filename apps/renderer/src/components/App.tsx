import React from "react";
import { DialogProvider, ToastProvider } from "ui";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

import { theme } from "@styles/theme";

import { ConfigProvider } from "@components/Config/Provider";
import { PlayerProvider } from "@components/Player/Provider";

import { Routes } from "@pages";

import { ConfigData, MinimalMusic } from "@utils/types";

interface AppProps {
    initialConfig: ConfigData;
    initialMusics: MinimalMusic[];
}

export function App({ initialConfig, initialMusics }: AppProps) {
    return (
        <ApolloProvider client={apolloClient}>
            <CssVarsProvider theme={theme} defaultMode="dark">
                <ConfigProvider initialConfig={initialConfig}>
                    <ToastProvider>
                        <DialogProvider>
                            <PlayerProvider initialMusics={initialMusics}>
                                <Routes />
                            </PlayerProvider>
                        </DialogProvider>
                    </ToastProvider>
                </ConfigProvider>
            </CssVarsProvider>
        </ApolloProvider>
    );
}
