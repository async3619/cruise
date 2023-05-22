import React from "react";

import {
    PlayerProviderContext,
    PlayerProviderProps,
    PlayerProviderStates,
    PlayerEventMap,
} from "@components/Player/types";

import { MinimalMusicFragment } from "@queries";

import { noop } from "@utils/noop";
import { loadImageAsBlob } from "@utils/loadImage";

export const PlayerContext = React.createContext<PlayerProviderContext>({
    playPlaylist: noop,
    play: noop,
    pause: noop,
    stop: noop,
    forward: noop,
    backward: noop,
    seek: noop,
    addEventListener: noop,
    removeEventListener: noop,
    playing: false,
    playlist: null,
    playlistIndex: -1,
    playingMusic: null,
});

const MEDIASESSION_ACTIONS: MediaSessionAction[] = [
    "nexttrack",
    "pause",
    "play",
    "previoustrack",
    "seekbackward",
    "seekforward",
    "seekto",
    "stop",
];

export class PlayerProvider extends React.Component<PlayerProviderProps, PlayerProviderStates> {
    private readonly eventListeners = new Map<keyof PlayerEventMap, Set<PlayerEventMap[keyof PlayerEventMap]>>();
    private readonly audioRef = React.createRef<HTMLAudioElement>();
    private readonly contextValue: PlayerProviderContext = {
        playPlaylist: this.playPlaylist.bind(this),
        play: this.play.bind(this),
        pause: this.pause.bind(this),
        stop: this.stop.bind(this),
        forward: this.forward.bind(this),
        backward: this.backward.bind(this),
        seek: this.seek.bind(this),
        addEventListener: this.addEventListener.bind(this),
        removeEventListener: this.removeEventListener.bind(this),
        playing: false,
        playlist: null,
        playlistIndex: -1,
        playingMusic: null,
    };

    public state: PlayerProviderStates = {
        playlist: [],
        playing: false,
        playlistIndex: -1,
    };

    public componentDidMount() {
        for (const targetAction of MEDIASESSION_ACTIONS) {
            navigator.mediaSession.setActionHandler(targetAction, this.handleMediaSessionAction.bind(this));
        }
    }
    public componentWillUnmount() {
        for (const targetAction of MEDIASESSION_ACTIONS) {
            navigator.mediaSession.setActionHandler(targetAction, null);
        }
    }

    private handlePlay = () => {
        this.setState({ playing: true });
    };
    private handlePause = () => {
        this.setState({ playing: false });
    };
    private handleTimeUpdate = () => {
        const { current: audio } = this.audioRef;
        if (!audio) {
            return;
        }

        const position = audio.currentTime;
        this.dispatchEvent("timeUpdate", position);
    };
    private handleEnded = () => {
        this.forward();
    };
    private handleCanPlay = async () => {
        const { playlist, playlistIndex } = this.state;
        if (!playlist) {
            return;
        }

        const music = playlist[playlistIndex];
        const albumArtUrl = await loadImageAsBlob(`cruise://${music.albumArts[0].path}`);

        navigator.mediaSession.metadata = new MediaMetadata({
            title: music.title,
            artist: music.albumArtist || "Unknown Artist",
            album: music.album?.title || "Unknown Album",
            artwork: [
                {
                    src: albumArtUrl,
                    sizes: `${music.albumArts[0].width}x${music.albumArts[0].height}`,
                    type: music.albumArts[0].mimeType,
                },
            ],
        });
    };
    private handleMediaSessionAction = (details: MediaSessionActionDetails) => {
        console.log(details);
        switch (details.action) {
            case "nexttrack":
                this.forward();
                return;

            case "previoustrack":
                this.backward();
                return;

            case "pause":
                this.pause();
                return;

            case "play":
                this.play();
                return;
        }
    };

    public playPlaylist(playlist: MinimalMusicFragment[], index: number) {
        this.setState({ playlist: [...playlist], playlistIndex: index }, () => {
            this.play();
        });
    }

    public play() {
        const { current: audio } = this.audioRef;
        if (!audio) {
            return;
        }

        audio.play();
        this.handleTimeUpdate();
    }
    public pause() {
        const { current: audio } = this.audioRef;
        if (!audio) {
            return;
        }

        audio.pause();
    }
    public stop() {
        const { current: audio } = this.audioRef;
        if (!audio) {
            return;
        }

        audio.pause();
        audio.currentTime = 0;
    }

    public seekPlaylist(index: number) {
        const { playlist } = this.state;
        if (!playlist) {
            return;
        }

        if (index < 0 || index >= playlist.length) {
            return;
        }

        this.setState({ playlistIndex: index }, () => {
            this.play();
        });
    }

    public forward() {
        this.seekPlaylist(this.state.playlistIndex + 1);
    }
    public backward() {
        this.seekPlaylist(this.state.playlistIndex - 1);
    }

    public seek(position: number) {
        const { current: audio } = this.audioRef;
        if (!audio) {
            return;
        }

        audio.currentTime = position;
    }

    public addEventListener<TKey extends keyof PlayerEventMap>(type: TKey, listener: PlayerEventMap[TKey]) {
        const listeners = this.eventListeners.get(type) ?? new Set();
        listeners.add(listener);

        this.eventListeners.set(type, listeners);
    }
    public removeEventListener<TKey extends keyof PlayerEventMap>(type: TKey, listener: PlayerEventMap[TKey]) {
        const listeners = this.eventListeners.get(type) ?? new Set();
        listeners.delete(listener);

        this.eventListeners.set(type, listeners);
    }
    public dispatchEvent<TKey extends keyof PlayerEventMap>(type: TKey, ...args: Parameters<PlayerEventMap[TKey]>) {
        const listeners = this.eventListeners.get(type) ?? new Set();
        for (const listener of listeners) {
            listener(...(args as [any]));
        }
    }

    public render() {
        const { children } = this.props;
        const { playing, playlist, playlistIndex } = this.state;
        const currentMusic = playlist?.[playlistIndex] ?? null;

        return (
            <PlayerContext.Provider
                value={{
                    ...this.contextValue,
                    playing,
                    playlist,
                    playlistIndex,
                    playingMusic: currentMusic,
                }}
            >
                <audio
                    ref={this.audioRef}
                    style={{ display: "none" }}
                    onCanPlay={this.handleCanPlay}
                    onPlay={this.handlePlay}
                    onPause={this.handlePause}
                    onTimeUpdate={this.handleTimeUpdate}
                    onEnded={this.handleEnded}
                    src={currentMusic ? `cruise://${currentMusic.path}` : undefined}
                />
                {children}
            </PlayerContext.Provider>
        );
    }
}

export function usePlayer() {
    return React.useContext(PlayerContext);
}
