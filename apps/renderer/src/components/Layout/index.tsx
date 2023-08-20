import React from "react";

import { Global } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import { TitleBar } from "@components/Layout/TitleBar";
import { SideBar } from "@components/Layout/SideBar";

import { Body, GlobalStyles, Main, Root } from "@components/Layout/index.styles";

export interface LayoutProps {}

export function Layout({ children }: React.PropsWithChildren<LayoutProps>) {
    return (
        <Root>
            <Global styles={GlobalStyles} />
            <CssBaseline />
            <TitleBar />
            <Body>
                <SideBar />
                <Main>{children}</Main>
            </Body>
        </Root>
    );
}
