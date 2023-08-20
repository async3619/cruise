import React from "react";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

import { theme } from "@styles/theme";

import { Layout } from "@components/Layout";
import { Routes } from "@pages";

export function App() {
    return (
        <ApolloProvider client={apolloClient}>
            <CssVarsProvider theme={theme} defaultMode="dark">
                <Layout>
                    <Routes />
                </Layout>
            </CssVarsProvider>
        </ApolloProvider>
    );
}
