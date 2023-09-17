import React from "react";
import { MinimalAlbum, MinimalMusic } from "@utils/types";

export interface SelectionContextValue<T> {
    selectedIndices: number[];
    allItems: T[];

    setSelection(indices: number[]): void;
}

export const MusicSelectionContext = React.createContext<SelectionContextValue<MinimalMusic> | null>(null);
export const AlbumSelectionContext = React.createContext<SelectionContextValue<MinimalAlbum> | null>(null);

export function useMusicSelection() {
    return React.useContext(MusicSelectionContext);
}

export function useAlbumSelection() {
    return React.useContext(AlbumSelectionContext);
}
