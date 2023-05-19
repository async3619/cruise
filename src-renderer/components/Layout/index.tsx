import React from "react";
import { Outlet } from "react-router-dom";

import { CssBaseline } from "@mui/material";
import { Global } from "@emotion/react";

import { Header } from "@components/Layout/Header";
import { Navigation } from "@components/Layout/Navigation";

import { Body, Content, GlobalStyles, Root } from "@components/Layout/index.styles";

export interface LayoutProps {}

export function Layout({}: LayoutProps) {
    return (
        <Root>
            <CssBaseline />
            <Global styles={GlobalStyles} />
            <Header />
            <Body>
                <Navigation />
                <Content>
                    <Outlet />
                </Content>
            </Body>
        </Root>
    );
}
