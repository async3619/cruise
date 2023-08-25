import React from "react";
import { ToastProvider } from "ui";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

import { theme } from "@styles/theme";

import { ConfigProvider } from "@components/Config/Provider";

import { ConfigData } from "@utils/types";
import { Routes } from "@pages";

interface AppProps {
    initialConfig: ConfigData;
}

export function App({ initialConfig }: AppProps) {
    return (
        <ApolloProvider client={apolloClient}>
            <CssVarsProvider theme={theme} defaultMode="dark">
                <ConfigProvider initialConfig={initialConfig}>
                    <ToastProvider>
                        <Routes />
                    </ToastProvider>
                </ConfigProvider>
            </CssVarsProvider>
        </ApolloProvider>
    );
}
