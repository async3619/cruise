import React from "react";

import { PlayableMusic } from "@utils/types";

export interface PlayerContextValue {
    playlist: PlayableMusic[];
    currentMusic: PlayableMusic | null;
    isPlaying: boolean;
    play(playlist?: PlayableMusic[], music?: PlayableMusic): void;
    pause(): void;
    previous(): void;
    next(): void;
    getAudio(): HTMLAudioElement;
}

export const PlayerContext = React.createContext<PlayerContextValue>({
    isPlaying: false,
    playlist: [],
    currentMusic: null,
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
});
