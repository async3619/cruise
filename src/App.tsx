import React from "react";
import { HashRouter } from "react-router-dom";

import { ipcLink } from "electron-trpc/renderer";

import { ThemeProvider } from "@mui/material";
import Router from "@components/Router";

import { QueryClient } from "@tanstack/react-query";

import { mainTheme } from "@styles/theme";

import { trpcReact } from "@/api";

export default function App() {
    const [queryClient] = React.useState(() => new QueryClient());
    const [trpcClient] = React.useState(() =>
        trpcReact.createClient({
            links: [ipcLink()],
        }),
    );

    return (
        <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
            <ThemeProvider theme={mainTheme}>
                <HashRouter>
                    <Router />
                </HashRouter>
            </ThemeProvider>
        </trpcReact.Provider>
    );
}
