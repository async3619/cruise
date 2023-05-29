import _ from "lodash";
import React from "react";
import { Outlet } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";

import { CssBaseline } from "@mui/material";
import { Global } from "@emotion/react";

import { Header } from "@components/Layout/Header";
import { Navigation } from "@components/Layout/Navigation";
import { LayoutContextValue, LayoutMusicActions, LayoutMusicState } from "@components/Layout/types";
import { PlayerToolbar } from "@components/Player/Toolbar";
import { ScrollThumb } from "@components/ui/ScrollThumb";
import { ToastContainer } from "@components/Toast/Container";

import { Body, Content, ContentWrapper, GlobalStyles, Root } from "@components/Layout/index.styles";

import { MinimalMusicFragment } from "@queries";

export const LayoutContext = React.createContext<LayoutContextValue | null>(null);

export function useLayout() {
    const context = React.useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }

    return context;
}
export function useLayoutMusics() {
    return useLayout().musics;
}

export function Layout() {
    const [scrollView, setScrollView] = React.useState<HTMLDivElement | null>(null);
    const [musics, setMusics] = React.useState<ReadonlyArray<MinimalMusicFragment>>([]);
    const [selectedIndices, setSelectedIndices] = React.useState<ReadonlyArray<number>>([]);

    const setItems = React.useCallback(
        (newItems: ReadonlyArray<MinimalMusicFragment>) => {
            if (newItems === musics) {
                return;
            }

            setMusics(newItems);
            setSelectedIndices([]);
        },
        [musics],
    );

    const selectMusic = React.useCallback((index: number | number[]) => {
        if (typeof index === "number") {
            setSelectedIndices(oldItems => {
                const newItems = [...oldItems];
                if (newItems.includes(index)) {
                    newItems.splice(newItems.indexOf(index), 1);
                } else {
                    newItems.push(index);
                }

                return _.orderBy(newItems, i => i, "asc");
            });
        } else {
            setSelectedIndices(oldItems => {
                const newItems = [...oldItems, ...index];

                return _.chain(newItems)
                    .orderBy(i => i, "asc")
                    .uniq()
                    .value();
            });
        }
    }, []);

    const cancelAll = React.useCallback(() => {
        setSelectedIndices([]);
    }, []);
    const checkAll = React.useCallback(() => {
        setSelectedIndices(_.range(musics.length));
    }, [musics]);

    const layoutMusics = React.useMemo<LayoutMusicState & LayoutMusicActions>(
        () => ({
            musics,
            selectedIndices,
            selectedMusics: selectedIndices.map(index => musics[index]),
            setItems,
            selectMusic,
            cancelAll,
            selectAll: checkAll,
        }),
        [musics, selectMusic, selectedIndices, setItems, cancelAll, checkAll],
    );

    return (
        <LayoutContext.Provider
            value={{
                scrollView,
                musics: layoutMusics,
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
    );
}
