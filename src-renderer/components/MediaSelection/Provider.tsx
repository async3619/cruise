import React from "react";

import { useMediaSelectionServer, MediaSelection } from "@components/MediaSelection/useServer";

import { MinimalAlbumFragment, MinimalMusicFragment } from "@queries";

interface MediaSelectionContextValue {
    music: MediaSelection<MinimalMusicFragment>;
    album: MediaSelection<MinimalAlbumFragment>;
}

export type SelectableMediaType = keyof MediaSelectionContextValue;

export const MediaSelectionContext = React.createContext<MediaSelectionContextValue | null>(null);

export function useMediaSelection() {
    const context = React.useContext(MediaSelectionContext);
    if (!context) {
        throw new Error("useMediaSelection must be used within a MediaSelectionProvider");
    }

    return context;
}

export function useMusicSelection() {
    return useMediaSelection().music;
}

export function useAlbumSelection() {
    return useMediaSelection().album;
}

interface Props {
    children: React.ReactNode;
}

export function MediaSelectionProvider({ children }: Props) {
    const music = useMediaSelectionServer<MinimalMusicFragment>();
    const album = useMediaSelectionServer<MinimalAlbumFragment>();

    return (
        <MediaSelectionContext.Provider
            value={{
                music,
                album,
            }}
        >
            {children}
        </MediaSelectionContext.Provider>
    );
}
