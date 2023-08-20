import React from "react";

import { Global } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import { TitleBar } from "@components/Layout/TitleBar";
import { GlobalStyles, Main, Root } from "@components/Layout/index.styles";

export interface LayoutProps {}

export function Layout({ children }: React.PropsWithChildren<LayoutProps>) {
    return (
        <Root>
            <Global styles={GlobalStyles} />
            <CssBaseline />
            <TitleBar />
            <Main>{children}</Main>
        </Root>
    );
}
