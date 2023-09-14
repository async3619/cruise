import React from "react";
import { MinimalMusic } from "@utils/types";

export interface MusicSelectionContextValue {
    selectedIndices: number[];
    allItems: MinimalMusic[];

    setSelection(indices: number[]): void;
}

export const MusicSelectionContext = React.createContext<MusicSelectionContextValue | null>(null);

export function useMusicSelection() {
    return React.useContext(MusicSelectionContext);
}
