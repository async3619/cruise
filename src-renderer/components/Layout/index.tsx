import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Global } from "@emotion/react";
import { CssBaseline, useMediaQuery, useTheme } from "@mui/material";

import TitleBar from "@components/Layout/TitleBar";
import SideBar, { SideBarState } from "@components/Layout/SideBar";
import PlayerControl from "@components/Player/Panel";

import { GlobalStyles, Main, MainWrapper, Root } from "@components/Layout/index.styles";
import { LayoutProvider } from "@components/Layout/context";

export interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
    const { children } = props;
    const theme = useTheme();

    const [sideBarWidth, setSideBarWidth] = React.useState<number | null>(null);
    const [sideBarOpen, setSideBarOpen] = React.useState<boolean>(false);
    const [playerPanelHeight, setPlayerPanelHeight] = React.useState<number | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const sideBarShrink = useMediaQuery(theme.breakpoints.down("md"));
    const sideBarHidden = useMediaQuery(theme.breakpoints.down("sm"));

    let sideBarState: SideBarState = "default";
    if (sideBarShrink) {
        sideBarState = "shrink";
    }

    if (sideBarHidden) {
        sideBarState = "hidden";
    }

    return (
        <LayoutProvider
            value={{
                sideBarWidth,
                setSideBarWidth,
                sideBarOpen,
                setSideBarOpen,
                playerPanelHeight,
                setPlayerPanelHeight,
            }}
        >
            <Root>
                <CssBaseline />
                <Global styles={GlobalStyles} />
                <TitleBar />
                <MainWrapper style={{ bottom: playerPanelHeight || 0 }}>
                    <SideBar navigate={navigate} location={location} state={sideBarState} />
                    <Main>{children}</Main>
                </MainWrapper>
                <PlayerControl />
            </Root>
        </LayoutProvider>
    );
}
