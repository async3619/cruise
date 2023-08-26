import React from "react";

export interface LayoutContextValues {
    view: HTMLElement | null;
}

export const LayoutContext = React.createContext<LayoutContextValues | null>(null);

export function useLayout() {
    const context = React.useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a <Layout />");
    }

    return context;
}
