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
import { ToastContainer } from "@components/Toast/Container";

import { Body, Content, ContentWrapper, GlobalStyles, Root } from "@components/Layout/index.styles";
import { MediaSelectionProvider } from "@components/MediaSelection/Provider";

export const LayoutContext = React.createContext<LayoutContextValue | null>(null);

export function useLayout() {
    const context = React.useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }

    return context;
}

export function Layout() {
    const [scrollView, setScrollView] = React.useState<HTMLDivElement | null>(null);

    return (
        <MediaSelectionProvider>
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
                        <ToastContainer />
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
        </MediaSelectionProvider>
    );
}
