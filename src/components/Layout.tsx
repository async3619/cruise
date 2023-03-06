import React from "react";

import { Global } from "@emotion/react";
import { Box, CssBaseline } from "@mui/material";

import TitleBar from "@components/TitleBar";
import SideBar from "@components/SideBar";

import { GlobalStyles, Main, Root } from "@components/Layout.styles";
import PlayerControl from "@components/PlayerControl";

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
            <Box display="flex">
                <SideBar />
                <Main>{children}</Main>
            </Box>
            <PlayerControl />
        </Root>
    );
}
