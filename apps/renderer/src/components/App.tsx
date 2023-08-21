import React from "react";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

import { theme } from "@styles/theme";

import { Routes } from "@pages";

export function App() {
    return (
        <ApolloProvider client={apolloClient}>
            <CssVarsProvider theme={theme} defaultMode="dark">
                <Routes />
            </CssVarsProvider>
        </ApolloProvider>
    );
}
