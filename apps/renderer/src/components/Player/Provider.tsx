import React from "react";
import { Nullable } from "types";
import { BaseEventMap, EventEmitter } from "utils";

import { PlayerContext } from "@components/Player/context";

import { MinimalMusic } from "@utils/types";

export interface PlayerEvents extends BaseEventMap {
    timeUpdate: (currentTime: number) => void;
}

export enum RepeatMode {
    None,
    One,
    All,
}

export interface PlayerProps {
    initialMusics: MinimalMusic[];
}

export interface Player {
    playlist: MinimalMusic[];
    currentIndex: number;
    isPlaying: boolean;

    canSeekBackward(): boolean;
    canSeekForward(): boolean;

    setMuted(muted: boolean): void;
    setVolume(volume: number, persist?: boolean): void;
    volume: number;
    muted: boolean;

    setRepeatMode(mode: RepeatMode): void;
    repeatMode: RepeatMode;

    shufflePlaylist(): void;
    playPlaylist(musics: MinimalMusic[], index?: number, shuffled?: boolean): void;
    seekPlaylist(index: number): void;
    clearPlaylist(): void;
    deletePlaylistItems(indices: number[]): void;

    play(): void;
    pause(): void;
    stop(): void;

    getCurrentMusic(): Nullable<MinimalMusic>;
    seekTo(time: number): void;

    events: EventEmitter<PlayerEvents>;
}

export class PlayerProvider extends React.Component<React.PropsWithChildren<PlayerProps>, Player> {
    private readonly audioRef = React.createRef<HTMLAudioElement>();

    public state: Player = {
        playlist: [],
        currentIndex: -1,
        isPlaying: false,

        shufflePlaylist: this.shufflePlaylist.bind(this),
        setRepeatMode: this.setRepeatMode.bind(this),
        repeatMode: Number(localStorage.getItem("repeatMode")) || RepeatMode.None,

        setMuted: this.setMuted.bind(this),
        setVolume: this.setVolume.bind(this),
        volume: Number(localStorage.getItem("volume")) || 0.5,
        muted: localStorage.getItem("muted") === "true",

        canSeekBackward: this.canSeekBackward.bind(this),
        canSeekForward: this.canSeekForward.bind(this),

        playPlaylist: this.playPlaylist.bind(this),
        seekPlaylist: this.seekPlaylist.bind(this),
        clearPlaylist: this.clearPlaylist.bind(this),
        deletePlaylistItems: this.deletePlaylistItems.bind(this),

        play: this.play.bind(this),
        pause: this.pause.bind(this),
        stop: this.stop.bind(this),

        getCurrentMusic: this.getCurrentMusic.bind(this),
        seekTo: this.seekTo.bind(this),

        events: new EventEmitter<PlayerEvents>(),
    };

    public get audio() {
        if (!this.audioRef.current) {
            throw new Error("Audio element is not mounted");
        }

        return this.audioRef.current;
    }

    public componentDidMount() {
        const { volume, muted } = this.state;

        this.audio.volume = volume;
        this.audio.muted = muted;

        this.handleQueryFinished();

        const targetActions: MediaSessionAction[] = ["play", "pause", "stop", "nexttrack", "previoustrack"];
        for (const action of targetActions) {
            navigator.mediaSession.setActionHandler(action, this.handleMediaSessionAction.bind(this, action));
        }
    }
    public componentDidUpdate(_: Readonly<React.PropsWithChildren>, prevState: Readonly<Player>) {
        if (prevState.repeatMode !== this.state.repeatMode) {
            localStorage.setItem("repeatMode", String(this.state.repeatMode));
        }

        if (prevState.playlist !== this.state.playlist) {
            const musicIds = this.state.playlist.map(music => music.id);
            localStorage.setItem("playlist", JSON.stringify(musicIds));
        }

        if (prevState.currentIndex !== this.state.currentIndex) {
            localStorage.setItem("currentIndex", String(this.state.currentIndex));
        }
    }

    public setRepeatMode(mode: RepeatMode) {
        this.setState({ repeatMode: mode });
    }

    public getCurrentMusic(): Nullable<MinimalMusic> {
        const { playlist, currentIndex } = this.state;
        if (currentIndex < 0 || currentIndex >= playlist.length) {
            return null;
        }

        return playlist[currentIndex];
    }

    public shufflePlaylist() {
        this.setState(prev => {
            const { playlist, currentIndex } = prev;
            const currentMusic = playlist[currentIndex];
            const newPlaylist = [...playlist];

            newPlaylist.splice(currentIndex, 1);
            newPlaylist.sort(() => Math.random() - 0.5);

            if (currentMusic) {
                newPlaylist.splice(currentIndex, 0, currentMusic);
            }

            return { playlist: newPlaylist };
        });
    }
    public async playPlaylist(musics: MinimalMusic[], index = 0, shuffled = false) {
        const playlist = [...musics];
        if (shuffled) {
            playlist.sort(() => Math.random() - 0.5);
        }

        this.setState({ playlist, currentIndex: index }, () => {
            this.audio.play();
            this.handleTimeUpdate();
        });
    }
    public async seekPlaylist(index: number) {
        const { repeatMode } = this.state;

        let currentIndex: number;
        if (repeatMode === RepeatMode.All) {
            if (index < 0) {
                currentIndex = this.state.playlist.length - 2 - index;
            } else {
                currentIndex = index % this.state.playlist.length;
            }
        } else {
            currentIndex = Math.max(0, Math.min(index, this.state.playlist.length - 1));
        }

        this.setState({ currentIndex }, () => {
            this.audio.play();
            this.handleTimeUpdate();
        });
    }
    public async clearPlaylist() {
        this.setState({ playlist: [], currentIndex: -1 });
    }
    public async deletePlaylistItems(indices: number[]) {
        let matched = false;

        this.setState(
            prev => {
                const newItems = [...prev.playlist];
                let currentIndex = prev.currentIndex;
                for (const index of indices) {
                    newItems.splice(index, 1);
                }

                if (indices.includes(currentIndex)) {
                    currentIndex = 0;
                    matched = true;
                }

                return { playlist: newItems, currentIndex };
            },
            () => {
                if (matched) {
                    this.pause();
                    this.handlePause();
                }
            },
        );
    }

    public setMuted(muted: boolean) {
        this.audio.muted = muted;

        localStorage.setItem("muted", String(muted));
        this.setState({ muted });

        if (!muted) {
            this.setVolume(this.state.volume);
        }
    }
    public setVolume(volume: number, persist = false) {
        if (!volume && persist) {
            this.setMuted(true);
            return;
        }

        this.audio.volume = volume;

        if (persist) {
            localStorage.setItem("volume", String(volume));
            this.setState({ volume });
        }
    }

    public canSeekBackward() {
        const { repeatMode, currentIndex, playlist } = this.state;
        if (playlist.length === 0) {
            return false;
        }

        if (repeatMode === RepeatMode.All) {
            return true;
        }

        return currentIndex > 0;
    }
    public canSeekForward() {
        const { repeatMode, currentIndex, playlist } = this.state;
        if (playlist.length === 0) {
            return false;
        }

        if (repeatMode === RepeatMode.All) {
            return true;
        }

        return currentIndex + 1 < playlist.length;
    }

    public async play() {
        this.audio.play();
        this.handleTimeUpdate();
    }
    public async pause() {
        this.audio.pause();
    }
    public async stop() {
        this.audio.pause();
        this.audio.currentTime = 0;

        this.setState({ playlist: [], currentIndex: -1 });
    }

    public seekTo(time: number) {
        this.audio.currentTime = time;
    }

    private handleQueryFinished = () => {
        const { initialMusics: musics } = this.props;
        const musicMap = new Map<number, MinimalMusic>();
        for (const music of musics) {
            musicMap.set(music.id, music);
        }

        const playlist = JSON.parse(localStorage.getItem("playlist") ?? "[]") as number[];
        const playlistMusics = playlist
            .filter((id: number) => musicMap.has(id))
            .map<MinimalMusic>((id: number) => musicMap.get(id)!);

        let currentIndex = Number(localStorage.getItem("currentIndex")) || 0;
        if (currentIndex < 0 || currentIndex >= playlist.length) {
            currentIndex = 0;
        }

        if (playlist.length > 0 && playlistMusics.length > 0) {
            this.setState({ playlist: playlistMusics, currentIndex });

            if (playlistMusics.length !== playlist.length) {
                localStorage.setItem("playlist", JSON.stringify(playlistMusics.map(music => music.id)));
            }
        }
    };
    private handlePlay = () => {
        this.setState({ isPlaying: true });
    };
    private handlePause = () => {
        this.setState({ isPlaying: false });
    };
    private handleTimeUpdate = () => {
        const { events } = this.state;

        events.emit("timeUpdate", this.audio.currentTime);
    };
    private handleEnded = () => {
        const { currentIndex, playlist, repeatMode } = this.state;
        if (repeatMode !== RepeatMode.All && currentIndex + 1 >= playlist.length) {
            return;
        } else if (repeatMode === RepeatMode.One) {
            this.play();
            return;
        }

        this.seekPlaylist(currentIndex + 1);
    };
    private handleMediaSessionAction = (action: MediaSessionAction) => {
        switch (action) {
            case "play":
                this.play();
                break;

            case "pause":
                this.pause();
                break;

            case "stop":
                this.stop();
                break;

            case "nexttrack":
                this.seekPlaylist(this.state.currentIndex + 1);
                break;

            case "previoustrack":
                this.seekPlaylist(this.state.currentIndex - 1);
                break;
        }
    };

    public render() {
        const { children } = this.props;
        const currentMusic = this.getCurrentMusic();

        return (
            <PlayerContext.Provider value={{ ...this.state }}>
                {children}
                <audio
                    style={{ display: "none" }}
                    ref={this.audioRef}
                    src={currentMusic?.url}
                    controls={true}
                    onPlay={this.handlePlay}
                    onPause={this.handlePause}
                    onEnded={this.handleEnded}
                    onTimeUpdate={this.handleTimeUpdate}
                />
            </PlayerContext.Provider>
        );
    }
}
