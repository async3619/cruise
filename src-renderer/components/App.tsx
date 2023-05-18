import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import { Layout } from "@components/Layout";

import { Home } from "@pages/Home";

import { theme } from "@styles/theme";

export interface AppProps {}

export function App({}: AppProps) {
    const router = React.useMemo(() => {
        return createBrowserRouter(
            createRoutesFromElements(
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<Home />} />
                </Route>,
            ),
        );
    }, []);

    return (
        <CssVarsProvider theme={theme}>
            <RouterProvider router={router} />
        </CssVarsProvider>
    );
}
