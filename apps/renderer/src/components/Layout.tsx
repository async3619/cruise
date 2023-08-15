import React from "react";

import { Global } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import { GlobalStyles, Root } from "@components/Layout.styles";

export interface LayoutProps {}

export function Layout({ children }: React.PropsWithChildren<LayoutProps>) {
    return (
        <Root>
            <Global styles={GlobalStyles} />
            <CssBaseline />
            {children}
        </Root>
    );
}
