import * as React from "react";
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
} from "@mui/material/styles";

import { ToastProvider } from "../src/Toast/Provider";

const theme = extendTheme();

export function Wrapper({ children }: React.PropsWithChildren) {
    return (
        <ToastProvider>
            <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
        </ToastProvider>
    );
}
