import React from "react";

export interface LayoutContextValue {
    sideBarWidth: number | null;
    setSideBarWidth: (width: number | null) => void;

    sideBarOpen: boolean;
    setSideBarOpen: (open: boolean) => void;

    playerPanelHeight: number | null;
    setPlayerPanelHeight: (height: number | null) => void;
}

export const LayoutContext = React.createContext<LayoutContextValue>({
    sideBarWidth: null,
    setSideBarWidth: () => {
        throw new Error("LayoutContext is not initialized");
    },

    sideBarOpen: false,
    setSideBarOpen: () => {
        throw new Error("LayoutContext is not initialized");
    },

    playerPanelHeight: null,
    setPlayerPanelHeight: () => {
        throw new Error("LayoutContext is not initialized");
    },
});

export const LayoutProvider = LayoutContext.Provider;
