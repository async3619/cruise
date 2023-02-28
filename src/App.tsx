import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material";
import Router from "@components/Router";

import { mainTheme } from "@styles/theme";

export default function App() {
    return (
        <ThemeProvider theme={mainTheme}>
            <MemoryRouter initialEntries={["/"]}>
                <Router />
            </MemoryRouter>
        </ThemeProvider>
    );
}
