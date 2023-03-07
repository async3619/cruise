import * as _ from "lodash";
import React from "react";

import { PlayerContext, PlayerContextValue, RepeatMode } from "@player/context";

export interface PlayerProviderProps {
    children: React.ReactNode;
}
export interface PlayerProviderStates extends PlayerContextValue {}

export default class PlayerProvider extends React.Component<PlayerProviderProps, PlayerProviderStates> {
    private readonly audioRef = React.createRef<HTMLAudioElement>();

    constructor(props: Readonly<PlayerProviderProps> | PlayerProviderProps) {
        super(props);

        this.state = {
            currentMusic: null,
            playlist: [],
            isPlaying: false,
            repeatMode: RepeatMode.None,
            play: this.play,
            pause: this.pause,
            getAudio: this.getAudio,
            next: this.next,
            previous: this.previous,
            hasNext: this.hasNext,
            hasPrevious: this.hasPrevious,
            toggleRepeatMode: this.toggleRepeatMode,
            shuffle: this.shufflePlaylist,
        };
    }

    public componentDidMount() {
        if (!this.audioRef.current) {
            return;
        }

        this.audioRef.current.addEventListener("pause", this.handlePause);
        this.audioRef.current.addEventListener("play", this.handlePlay);
        this.audioRef.current.addEventListener("ended", this.handleEnded);

        navigator.mediaSession.setActionHandler("play", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("pause", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("stop", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("seekbackward", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("seekforward", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("seekto", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("previoustrack", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("nexttrack", this.handleMediaSessionAction);
    }
    public componentWillUnmount() {
        if (!this.audioRef.current) {
            return;
        }

        this.audioRef.current.removeEventListener("pause", this.handlePause);
        this.audioRef.current.removeEventListener("play", this.handlePlay);
        this.audioRef.current.removeEventListener("ended", this.handleEnded);

        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("stop", null);
        navigator.mediaSession.setActionHandler("seekbackward", null);
        navigator.mediaSession.setActionHandler("seekforward", null);
        navigator.mediaSession.setActionHandler("seekto", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
    }

    private handleMediaSessionAction = (e: MediaSessionActionDetails) => {
        switch (e.action) {
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
                this.next();
                break;

            case "previoustrack":
                this.previous();
                break;
        }
    };
    private handlePause = () => {
        this.setState({ isPlaying: false });
    };
    private handlePlay = () => {
        const { currentMusic } = this.state;
        if (!currentMusic) {
            return;
        }

        navigator.mediaSession.metadata = new MediaMetadata({
            title: currentMusic.title,
            artist: (currentMusic.album?.artists || currentMusic.artists).map(artist => artist.name).join(", "),
            album: currentMusic?.album?.title || "Unknown Album",
            artwork: [
                { src: "https://dummyimage.com/96x96", sizes: "96x96", type: "image/png" },
                { src: "https://dummyimage.com/128x128", sizes: "128x128", type: "image/png" },
                { src: "https://dummyimage.com/192x192", sizes: "192x192", type: "image/png" },
                { src: "https://dummyimage.com/256x256", sizes: "256x256", type: "image/png" },
                { src: "https://dummyimage.com/384x384", sizes: "384x384", type: "image/png" },
                { src: "https://dummyimage.com/512x512", sizes: "512x512", type: "image/png" },
            ],
        });

        this.setState({ isPlaying: true });
    };
    private handleEnded = () => {
        const { repeatMode } = this.state;
        if (repeatMode === RepeatMode.One) {
            this.play();
            return;
        }

        this.next();
    };

    private getAudio = () => {
        if (!this.audioRef.current) {
            throw new Error("Audio element is not ready");
        }

        return this.audioRef.current;
    };

    private shufflePlaylist = () => {
        if (!this.state.playlist) {
            return;
        }

        this.setState(state => ({
            playlist: _.shuffle(state.playlist),
        }));
    };

    private toggleRepeatMode = () => {
        const { repeatMode } = this.state;

        switch (repeatMode) {
            case RepeatMode.None:
                this.setState({ repeatMode: RepeatMode.All });
                break;

            case RepeatMode.All:
                this.setState({ repeatMode: RepeatMode.One });
                break;

            case RepeatMode.One:
                this.setState({ repeatMode: RepeatMode.None });
                break;
        }
    };

    private hasPrevious = () => {
        const { playlist, currentMusic, repeatMode } = this.state;
        if (!playlist || !currentMusic) {
            return false;
        }

        if (repeatMode === RepeatMode.All) {
            return true;
        }

        return playlist.indexOf(currentMusic) > 0;
    };
    private hasNext = () => {
        const { playlist, currentMusic, repeatMode } = this.state;
        if (!playlist || !currentMusic) {
            return false;
        }

        if (repeatMode === RepeatMode.All) {
            return true;
        }

        return playlist.indexOf(currentMusic) < playlist.length - 1;
    };

    private play: PlayerContextValue["play"] = async (playlist, music) => {
        if (!this.audioRef.current) {
            return;
        }

        if (!playlist || !music) {
            await this.audioRef.current.play();
            return;
        }

        const currentMusic = music || playlist[0];

        this.setState({
            playlist,
            currentMusic,
        });

        this.audioRef.current.src = `cruise://${currentMusic.path}`;
        await this.audioRef.current.play();
    };
    private pause = () => {
        if (!this.audioRef.current) {
            return;
        }

        this.audioRef.current.pause();
    };
    private stop = () => {
        if (!this.audioRef.current) {
            return;
        }

        this.audioRef.current.pause();
        this.audioRef.current.currentTime = 0;

        this.setState({
            currentMusic: null,
            playlist: [],
        });
    };
    private seekPlaylist = (delta: number) => {
        const { playlist, currentMusic, repeatMode } = this.state;
        if (!playlist || !currentMusic) {
            return;
        }

        const currentIndex = playlist.findIndex(music => music.id === currentMusic.id);

        let nextIndex = currentIndex + delta;
        if (repeatMode === RepeatMode.All) {
            if (nextIndex < 0) {
                nextIndex = playlist.length - 1;
            } else if (nextIndex >= playlist.length) {
                nextIndex = 0;
            }
        }

        const nextMusic = playlist[nextIndex];
        if (!nextMusic) {
            return;
        }

        this.play(playlist, nextMusic);
    };
    private next = () => {
        this.seekPlaylist(1);
    };
    private previous = () => {
        if (!this.audioRef.current) {
            return;
        }

        if (this.audioRef.current.currentTime > 3) {
            this.audioRef.current.currentTime = 0;
            return;
        }

        this.seekPlaylist(-1);
    };

    public render() {
        const { children } = this.props;

        return (
            <PlayerContext.Provider value={{ ...this.state }}>
                {children}
                <audio ref={this.audioRef} onPause={this.handlePause} onPlay={this.handlePlay} />
            </PlayerContext.Provider>
        );
    }
}
