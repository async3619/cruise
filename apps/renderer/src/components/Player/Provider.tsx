import React from "react";
import { Nullable } from "types";
import { BaseEventMap, EventEmitter } from "utils";

import { PlayerContext } from "@components/Player/context";

import { MinimalMusic } from "@utils/types";

export interface PlayerEvents extends BaseEventMap {
    timeUpdate: (currentTime: number) => void;
}

export interface Player {
    playlist: MinimalMusic[];
    currentIndex: number;
    isPlaying: boolean;

    playPlaylist(musics: MinimalMusic[], index?: number): void;
    seekPlaylist(index: number): void;

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

        playPlaylist: this.playPlaylist.bind(this),
        seekPlaylist: this.seekPlaylist.bind(this),

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

    public getCurrentMusic(): Nullable<MinimalMusic> {
        const { playlist, currentIndex } = this.state;
        if (currentIndex < 0 || currentIndex >= playlist.length) {
            return null;
        }

        return playlist[currentIndex];
    }

    public async playPlaylist(musics: MinimalMusic[], index = 0) {
        this.setState({ playlist: [...musics], currentIndex: index }, () => {
            this.audio.play();
            this.handleTimeUpdate();
        });
    }
    public async seekPlaylist(index: number) {
        this.setState({ currentIndex: index }, () => {
            this.audio.play();
            this.handleTimeUpdate();
        });
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
        const { currentIndex, playlist } = this.state;
        if (currentIndex + 1 >= playlist.length) {
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
