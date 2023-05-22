import React from "react";
import { MinimalMusicFragment } from "@queries";

export interface PlayerProviderProps {
    children: React.ReactNode;
}
export interface PlayerProviderStates {
    playlist: MinimalMusicFragment[] | null;
    playlistIndex: number;
    playing: boolean;
}
export interface PlayerEventMap {
    timeUpdate(position: number): void;
}
export interface PlayerProviderContext {
    playPlaylist(playlist: MinimalMusicFragment[], index: number): void;
    play(): void;
    pause(): void;
    stop(): void;
    forward(): void;
    backward(): void;
    seek(position: number): void;
    addEventListener<TKey extends keyof PlayerEventMap>(type: TKey, listener: PlayerEventMap[TKey]): void;
    removeEventListener<TKey extends keyof PlayerEventMap>(type: TKey, listener: PlayerEventMap[TKey]): void;
    playing: boolean;
    playlist: ReadonlyArray<MinimalMusicFragment> | null;
    playlistIndex: number;
    playingMusic: MinimalMusicFragment | null;
}
