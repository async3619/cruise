import React from "react";

import { Global } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import TitleBar from "@components/TitleBar";
import SideBar from "@components/SideBar";

import { GlobalStyles, Main, Root } from "@components/Layout.styles";

export interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
    const { children } = props;

    return (
        <Root>
            <CssBaseline />
            <Global styles={GlobalStyles} />
            <TitleBar />
            <SideBar />
            <Main>{children}</Main>
        </Root>
    );
}
