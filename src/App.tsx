import React from "react";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@mui/material";
import Layout from "@components/Layout";
import { router } from "@/router";

import { mainTheme } from "@styles/theme";

export interface AppProps {}
export interface AppStates {}

export default class App extends React.Component<AppProps, AppStates> {
    public render() {
        return (
            <ThemeProvider theme={mainTheme}>
                <Layout>
                    <RouterProvider router={router} />
                </Layout>
            </ThemeProvider>
        );
    }
}
