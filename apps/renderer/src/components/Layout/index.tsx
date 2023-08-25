import React from "react";
import { Outlet } from "react-router-dom";
import { Scrollbars } from "rc-scrollbars";

import { ToastContainer } from "ui";

import { Global } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import { ScrollbarThumb } from "@components/ScrollbarThumb";
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
                    <Scrollbars autoHide renderThumbVertical={props => <ScrollbarThumb {...props} />}>
                        <Outlet />
                    </Scrollbars>
                </Main>
                <ToastContainer />
            </Body>
        </Root>
    );
}
