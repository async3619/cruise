import React from "react";
import { createHashRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import type { Mode } from "@mui/system/cssVars/useCurrentColorScheme";

import { ConfigProvider } from "@components/Config/Provider";
import { LibraryProvider } from "@components/Library/Provider";
import { PlayerProvider } from "@components/Player/Provider";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

import i18n from "@/i18n.config";

import { theme } from "@styles/theme";

import { Router } from "@pages";
import { DialogProvider } from "@components/Dialog/Provider";

export interface AppProps {}

export function App({}: AppProps) {
    const [defaultMode] = React.useState<Mode>();
    const router = React.useMemo(() => {
        return createHashRouter(createRoutesFromElements(Router));
    }, []);

    return (
        <ApolloProvider client={apolloClient}>
            <I18nextProvider i18n={i18n}>
                <CssVarsProvider theme={theme} defaultMode={defaultMode}>
                    <ConfigProvider>
                        <LibraryProvider>
                            <PlayerProvider>
                                <DialogProvider>
                                    <RouterProvider router={router} />
                                </DialogProvider>
                            </PlayerProvider>
                        </LibraryProvider>
                    </ConfigProvider>
                </CssVarsProvider>
            </I18nextProvider>
        </ApolloProvider>
    );
}
