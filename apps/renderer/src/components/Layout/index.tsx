import React from "react";
import { Outlet } from "react-router-dom";
import { Scrollbars } from "rc-scrollbars";

import { ToastContainer } from "ui";

import { Global } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import { ScrollbarThumb } from "@components/ScrollbarThumb";
import { LayoutContext } from "@components/Layout/context";
import { TitleBar } from "@components/Layout/TitleBar";
import { SideBar } from "@components/Layout/SideBar";
import { PlayerPanel } from "@components/Player/Panel";

import { Body, GlobalStyles, Main, Root } from "@components/Layout/index.styles";

export function Layout() {
    const [scrollbars, setScrollbars] = React.useState<Scrollbars | null>(null);

    return (
        <LayoutContext.Provider value={{ view: scrollbars?.view ?? null }}>
            <Root>
                <Global styles={GlobalStyles} />
                <CssBaseline />
                <TitleBar />
                <Body>
                    <SideBar />
                    <Main>
                        <Scrollbars
                            autoHide
                            ref={setScrollbars}
                            renderThumbVertical={props => <ScrollbarThumb {...props} />}
                        >
                            <Outlet />
                        </Scrollbars>
                    </Main>
                    <ToastContainer />
                </Body>
                <PlayerPanel />
            </Root>
        </LayoutContext.Provider>
    );
}
