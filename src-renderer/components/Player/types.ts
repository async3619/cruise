import React from "react";

import { MinimalMusicFragment, RepeatMode } from "@queries";

import { WithConfigProps } from "@components/Config/withConfig";

export interface PlayerProviderProps extends WithConfigProps {
    children: React.ReactNode;
}
export interface PlayerProviderStates {
    playlist: MinimalMusicFragment[] | null;
    playlistIndex: number;
    playing: boolean;
    volume: number;
    muted: boolean;
}
export interface PlayerEventMap {
    timeUpdate(position: number): void;
}

export interface PlayerProviderContext {
    playPlaylist(playlist: MinimalMusicFragment[], index?: number, shuffled?: boolean): void;
    clearPlaylist(): void;
    play(): void;
    pause(): void;
    stop(): void;
    seekForward(): void;
    seekBackward(): void;
    seek(position: number): void;
    addEventListener<TKey extends keyof PlayerEventMap>(type: TKey, listener: PlayerEventMap[TKey]): void;
    removeEventListener<TKey extends keyof PlayerEventMap>(type: TKey, listener: PlayerEventMap[TKey]): void;
    setRepeatMode(mode: RepeatMode): void;
    toggleRepeatMode(): void;
    shuffle(): void;
    setVolume(volume: number, save?: boolean): void;
    toggleMute(): void;
    setMuted(muted: boolean): void;
    volume: number;
    muted: boolean;
    repeatMode: RepeatMode;
    playing: boolean;
    playlist: ReadonlyArray<MinimalMusicFragment> | null;
    playlistIndex: number;
    playingMusic: MinimalMusicFragment | null;
    canSeekForward: boolean;
    canSeekBackward: boolean;
}
