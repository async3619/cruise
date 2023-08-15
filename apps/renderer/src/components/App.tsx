import React from "react";

import { ThemeProvider } from "@mui/material";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

import { theme } from "@styles/theme";

import { Layout } from "@components/Layout";

import { Routes } from "@pages";

export function App() {
    return (
        <ApolloProvider client={apolloClient}>
            <ThemeProvider theme={theme}>
                <Layout>
                    <Routes />
                </Layout>
            </ThemeProvider>
        </ApolloProvider>
    );
}
