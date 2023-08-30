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

export interface Player {
    playlist: MinimalMusic[];
    currentIndex: number;
    isPlaying: boolean;

    canSeekBackward(): boolean;
    canSeekForward(): boolean;

    setRepeatMode(mode: RepeatMode): void;
    repeatMode: RepeatMode;

    shufflePlaylist(): void;
    playPlaylist(musics: MinimalMusic[], index?: number, shuffled?: boolean): void;
    seekPlaylist(index: number): void;
    clearPlaylist(): void;

    play(): void;
    pause(): void;
    stop(): void;

    getCurrentMusic(): Nullable<MinimalMusic>;
    seekTo(time: number): void;

    events: EventEmitter<PlayerEvents>;
}

export class PlayerProvider extends React.Component<React.PropsWithChildren, Player> {
    private readonly audioRef = React.createRef<HTMLAudioElement>();

    public state: Player = {
        playlist: [],
        currentIndex: -1,
        isPlaying: false,

        shufflePlaylist: this.shufflePlaylist.bind(this),
        setRepeatMode: this.setRepeatMode.bind(this),
        repeatMode: RepeatMode.None,

        canSeekBackward: this.canSeekBackward.bind(this),
        canSeekForward: this.canSeekForward.bind(this),

        playPlaylist: this.playPlaylist.bind(this),
        seekPlaylist: this.seekPlaylist.bind(this),
        clearPlaylist: this.clearPlaylist.bind(this),

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

    public canSeekBackward() {
        const { repeatMode, currentIndex } = this.state;
        if (repeatMode === RepeatMode.All) {
            return true;
        }

        return currentIndex > 0;
    }
    public canSeekForward() {
        const { repeatMode, currentIndex, playlist } = this.state;
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
