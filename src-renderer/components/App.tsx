import React from "react";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import type { Mode } from "@mui/system/cssVars/useCurrentColorScheme";

import { Layout } from "@components/Layout";
import { ConfigProvider } from "@components/Config/Provider";

import { Home } from "@pages/Home";
import { Library } from "@pages/Library";
import { Settings } from "@pages/Settings";
import { Search } from "@pages/Search";
import { Artists } from "@pages/Artists";
import { Albums } from "@pages/Albums";
import { Musics } from "@pages/Musics";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@graphql/client";

import i18n from "@/i18n.config";

import { theme } from "@styles/theme";
import { LibraryProvider } from "@components/Library/Provider";

export interface AppProps {}

export function App({}: AppProps) {
    const [defaultMode] = React.useState<Mode>();
    const router = React.useMemo(() => {
        return createHashRouter(
            createRoutesFromElements(
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<Home />} />
                    <Route path="search" element={<Search />} />
                    <Route path="library" element={<Library />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="musics" element={<Musics />} />
                    <Route path="artists" element={<Artists />} />
                    <Route path="albums" element={<Albums />} />
                </Route>,
            ),
        );
    }, []);

    return (
        <ApolloProvider client={apolloClient}>
            <I18nextProvider i18n={i18n}>
                <CssVarsProvider theme={theme} defaultMode={defaultMode}>
                    <ConfigProvider>
                        <LibraryProvider>
                            <RouterProvider router={router} />
                        </LibraryProvider>
                    </ConfigProvider>
                </CssVarsProvider>
            </I18nextProvider>
        </ApolloProvider>
    );
}
