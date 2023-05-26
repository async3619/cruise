import React from "react";
import { Outlet } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";

import { CssBaseline } from "@mui/material";
import { Global } from "@emotion/react";

import { Header } from "@components/Layout/Header";
import { Navigation } from "@components/Layout/Navigation";
import { LayoutContextValue } from "@components/Layout/types";
import { PlayerToolbar } from "@components/Player/Toolbar";

import { ScrollThumb } from "@components/ui/ScrollThumb";

import { Body, Content, ContentWrapper, GlobalStyles, Root } from "@components/Layout/index.styles";

export interface LayoutProps {}

export const LayoutContext = React.createContext<LayoutContextValue>({
    scrollView: null,
});

export function useLayout() {
    return React.useContext(LayoutContext);
}

export function Layout({}: LayoutProps) {
    const [scrollView, setScrollView] = React.useState<HTMLDivElement | null>(null);

    return (
        <LayoutContext.Provider
            value={{
                scrollView,
            }}
        >
            <Root>
                <CssBaseline />
                <Global styles={GlobalStyles} />
                <Header />
                <Body>
                    <Navigation />
                    <Content>
                        <Scrollbars
                            autoHide
                            renderThumbVertical={props => <ScrollThumb {...props} />}
                            ref={scrollbars => {
                                if (!scrollbars) {
                                    return;
                                }

                                setScrollView((scrollbars as any).view);
                            }}
                        >
                            <ContentWrapper>
                                <Outlet />
                            </ContentWrapper>
                        </Scrollbars>
                    </Content>
                </Body>
                <PlayerToolbar />
            </Root>
        </LayoutContext.Provider>
    );
}
