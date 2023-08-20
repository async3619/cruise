import React from "react";
import { Outlet } from "react-router-dom";

import { Global } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import { TitleBar } from "@components/Layout/TitleBar";
import { SideBar } from "@components/Layout/SideBar";

import { Body, GlobalStyles, Main, Root } from "@components/Layout/index.styles";

export function Layout() {
    return (
        <Root>
            <Global styles={GlobalStyles} />
            <CssBaseline />
            <TitleBar />
            <Body>
                <SideBar />
                <Main>
                    <Outlet />
                </Main>
            </Body>
        </Root>
    );
}
