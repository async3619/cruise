import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme();

export function Wrapper({ children }: React.PropsWithChildren) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
