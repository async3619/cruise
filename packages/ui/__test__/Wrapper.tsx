import * as React from "react";
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
} from "@mui/material/styles";

const theme = extendTheme();

export function Wrapper({ children }: React.PropsWithChildren) {
    return <CssVarsProvider theme={theme}>{children}</CssVarsProvider>;
}
