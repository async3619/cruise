import * as _ from "lodash";
import React from "react";

import { EventHandlerMap, PlayerContext, PlayerContextValue, RepeatMode } from "@player/context";
import { PlayableMusic } from "@utils/types";

export interface PlayerProviderProps {
    children: React.ReactNode;
}
export interface PlayerProviderStates extends PlayerContextValue {}

export default class PlayerProvider extends React.Component<PlayerProviderProps, PlayerProviderStates> {
    private readonly audioRef = React.createRef<HTMLAudioElement>();
    private readonly eventHandlers: EventHandlerMap = {
        pause: [],
        play: [],
        progress: [],
        load: [],
    };

    constructor(props: Readonly<PlayerProviderProps> | PlayerProviderProps) {
        super(props);

        this.state = {
            currentMusic: null,
            playlist: [],
            isPlaying: false,
            repeatMode: RepeatMode.None,
            volume: 0,
            setVolume: this.setVolume,
            play: this.play,
            playShuffled: this.playShuffled,
            pause: this.pause,
            getAudio: this.getAudio,
            next: this.next,
            previous: this.previous,
            hasNext: this.hasNext,
            hasPrevious: this.hasPrevious,
            toggleRepeatMode: this.toggleRepeatMode,
            shuffle: this.shufflePlaylist,
            addEventListener: this.addEventListener,
            removeEventListener: this.removeEventListener,
            seekTo: this.seekTo,
            setPlaylist: this.setPlaylist,
        };
    }

    public componentDidMount() {
        if (!this.audioRef.current) {
            return;
        }

        this.audioRef.current.addEventListener("pause", this.handlePause);
        this.audioRef.current.addEventListener("play", this.handlePlay);
        this.audioRef.current.addEventListener("ended", this.handleEnded);
        this.audioRef.current.addEventListener("timeupdate", this.handleTimeUpdate);
        this.audioRef.current.addEventListener("canplay", this.handleCanPlay);

        navigator.mediaSession.setActionHandler("play", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("pause", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("stop", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("seekbackward", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("seekforward", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("seekto", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("previoustrack", this.handleMediaSessionAction);
        navigator.mediaSession.setActionHandler("nexttrack", this.handleMediaSessionAction);

        this.setState({ volume: this.audioRef.current.volume });
    }
    public componentWillUnmount() {
        if (!this.audioRef.current) {
            return;
        }

        this.audioRef.current.removeEventListener("pause", this.handlePause);
        this.audioRef.current.removeEventListener("play", this.handlePlay);
        this.audioRef.current.removeEventListener("ended", this.handleEnded);
        this.audioRef.current.removeEventListener("timeupdate", this.handleTimeUpdate);

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

        const audio = this.getAudio();
        if (!audio) {
            return;
        }

        this.eventHandlers.pause.forEach(handler => handler(audio.currentTime, audio.duration));
    };
    private handlePlay = () => {
        const { currentMusic, playlist } = this.state;
        const audio = this.getAudio();
        if (!currentMusic || !audio || !playlist.length) {
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

        this.eventHandlers.play.forEach(handler => handler(currentMusic, playlist));
    };
    private handleTimeUpdate = () => {
        const audio = this.getAudio();
        if (!audio) {
            return;
        }

        this.eventHandlers.progress.forEach(handler => handler(audio.currentTime, audio.duration));
    };
    private handleEnded = () => {
        const { repeatMode } = this.state;
        if (repeatMode === RepeatMode.One) {
            this.play();
            return;
        }

        this.next();
    };
    private handleCanPlay = () => {
        const audio = this.getAudio();
        if (!audio) {
            return;
        }

        this.eventHandlers.load.forEach(handler => handler(audio.currentTime, audio.duration));
    };

    private addEventListener: PlayerContextValue["addEventListener"] = (event, handler) => {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }

        this.eventHandlers[event].push(handler);
    };
    private removeEventListener: PlayerContextValue["removeEventListener"] = (event, handler) => {
        if (!this.eventHandlers[event]) {
            return;
        }

        const index = this.eventHandlers[event].indexOf(handler);
        if (index === -1) {
            return;
        }

        this.eventHandlers[event].splice(index, 1);
    };

    private getAudio = () => {
        if (!this.audioRef.current) {
            throw new Error("Audio element is not ready");
        }

        return this.audioRef.current;
    };
    private setVolume = (volume: number) => {
        const audio = this.getAudio();
        audio.volume = volume;
    };

    private seekTo = (time: number) => {
        const audio = this.getAudio();
        audio.currentTime = time;
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

        this.audioRef.current.src = `cruise://${encodeURIComponent(currentMusic.path)}`;
        await this.audioRef.current.play();
    };
    private playShuffled = (playlist: PlayableMusic[]) => {
        const shuffled = _.shuffle(playlist);
        return this.play(shuffled, shuffled[0]);
    };

    private setPlaylist = (playlist: PlayableMusic[]) => {
        this.setState({ playlist, currentMusic: playlist[0] });
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
