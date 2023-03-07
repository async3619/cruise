import React from "react";

import { PlayableMusic } from "@utils/types";

export enum RepeatMode {
    None = "none",
    One = "one",
    All = "all",
}

export interface PlayerEventMap {
    play(music: PlayableMusic, playlist: PlayableMusic[]): void;
    load(currentTime: number, duration: number): void;
    pause(currentTime: number, duration: number): void;
    progress(currentTime: number, duration: number): void;
}

export type EventHandlerMap = {
    [K in keyof PlayerEventMap]: PlayerEventMap[K][];
};

export interface PlayerContextValue {
    playlist: PlayableMusic[];
    currentMusic: PlayableMusic | null;
    isPlaying: boolean;
    repeatMode: RepeatMode;
    seekTo(time: number): void;
    play(playlist?: PlayableMusic[], music?: PlayableMusic): void;
    pause(): void;
    previous(): void;
    next(): void;
    getAudio(): HTMLAudioElement;
    toggleRepeatMode(): void;
    hasPrevious(): boolean;
    hasNext(): boolean;
    shuffle(): void;

    addEventListener<K extends keyof PlayerEventMap>(type: K, listener: PlayerEventMap[K]): void;
    removeEventListener<K extends keyof PlayerEventMap>(type: K, listener: PlayerEventMap[K]): void;

    volume: number;
    setVolume: (volume: number) => void;
}

export const PlayerContext = React.createContext<PlayerContextValue>({
    isPlaying: false,
    playlist: [],
    currentMusic: null,
    repeatMode: RepeatMode.None,
    seekTo: () => {
        throw new Error("Not implemented");
    },
    hasPrevious: () => {
        throw new Error("Not implemented");
    },
    hasNext: () => {
        throw new Error("Not implemented");
    },
    toggleRepeatMode: () => {
        throw new Error("Not implemented");
    },
    play: () => {
        throw new Error("Not implemented");
    },
    pause: () => {
        throw new Error("Not implemented");
    },
    previous: () => {
        throw new Error("Not implemented");
    },
    next: () => {
        throw new Error("Not implemented");
    },
    getAudio: () => {
        throw new Error("Not implemented");
    },
    shuffle: () => {
        throw new Error("Not implemented");
    },
    addEventListener: () => {
        throw new Error("Not implemented");
    },
    removeEventListener: () => {
        throw new Error("Not implemented");
    },
    volume: 0,
    setVolume: () => {
        throw new Error("Not implemented");
    },
});
