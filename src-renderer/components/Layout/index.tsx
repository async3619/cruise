import React from "react";
import { Outlet } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";

import { CssBaseline } from "@mui/material";
import { Global } from "@emotion/react";

import { Header } from "@components/Layout/Header";
import { Navigation } from "@components/Layout/Navigation";
import { PlayerToolbar } from "@components/Player/Toolbar";

import { Body, Content, ContentWrapper, GlobalStyles, Root } from "@components/Layout/index.styles";

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
                    <Scrollbars>
                        <ContentWrapper>
                            <Outlet />
                        </ContentWrapper>
                    </Scrollbars>
                </Content>
            </Body>
            <PlayerToolbar />
        </Root>
    );
}
