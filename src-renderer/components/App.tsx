import React from "react";
import {
    createBrowserRouter,
    createMemoryRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import { Layout } from "@components/Layout";

import { Home } from "@pages/Home";
import { Library } from "@pages/Library";
import { Settings } from "@pages/Settings";
import { Search } from "@pages/Search";

import { theme } from "@styles/theme";

export interface AppProps {}

export function App({}: AppProps) {
    const router = React.useMemo(() => {
        return createMemoryRouter(
            createRoutesFromElements(
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<Home />} />
                    <Route path="search" element={<Search />} />
                    <Route path="library" element={<Library />} />
                    <Route path="settings" element={<Settings />} />
                </Route>,
            ),
            {
                initialEntries: ["/"],
                initialIndex: 0,
            },
        );
    }, []);

    return (
        <CssVarsProvider theme={theme}>
            <RouterProvider router={router} />
        </CssVarsProvider>
    );
}
