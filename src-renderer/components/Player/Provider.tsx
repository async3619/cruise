import React from "react";
import _ from "lodash";

import {
    PlayerEventMap,
    PlayerProviderContext,
    PlayerProviderProps,
    PlayerProviderStates,
} from "@components/Player/types";

import { MinimalMusicFragment, RepeatMode } from "@queries";

import { PickFn } from "@common/types";
import { loadImageAsBlob } from "@utils/loadImage";
import { withConfig } from "@components/Config/withConfig";

export const PlayerContext = React.createContext<PlayerProviderContext>({} as any);

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

class PlayerProviderImpl extends React.Component<PlayerProviderProps, PlayerProviderStates> {
    private readonly eventListeners = new Map<keyof PlayerEventMap, Set<PlayerEventMap[keyof PlayerEventMap]>>();
    private readonly audioRef = React.createRef<HTMLAudioElement>();
    private readonly contextValue: PickFn<PlayerProviderContext> = {
        playPlaylist: this.playPlaylist.bind(this),
        play: this.play.bind(this),
        pause: this.pause.bind(this),
        stop: this.stop.bind(this),
        seekForward: this.seekForward.bind(this),
        seekBackward: this.seekBackward.bind(this),
        seek: this.seek.bind(this),
        addEventListener: this.addEventListener.bind(this),
        removeEventListener: this.removeEventListener.bind(this),
        setRepeatMode: this.setRepeatMode.bind(this),
        toggleRepeatMode: this.toggleRepeatMode.bind(this),
        shuffle: this.shuffle.bind(this),
        setVolume: this.setVolume.bind(this),
        toggleMute: this.toggleMute.bind(this),
        setMuted: this.setMuted.bind(this),
    };

    public state: PlayerProviderStates = {
        playlist: null,
        playing: false,
        playlistIndex: -1,
        volume: this.props.config.volume,
        muted: this.props.config.muted,
    };

    public get canSeekForward() {
        const { playlist, playlistIndex } = this.state;
        if (!playlist) {
            return false;
        }

        return !(this.repeatMode === RepeatMode.None && playlistIndex === playlist.length - 1);
    }
    public get canSeekBackward() {
        const { playlist, playlistIndex } = this.state;
        if (!playlist) {
            return false;
        }

        return !(this.repeatMode === RepeatMode.None && playlistIndex === 0);
    }
    public get repeatMode() {
        return this.props.config.repeatMode;
    }

    public componentDidMount() {
        for (const targetAction of MEDIASESSION_ACTIONS) {
            navigator.mediaSession.setActionHandler(targetAction, this.handleMediaSessionAction.bind(this));
        }

        if (this.audioRef.current) {
            this.audioRef.current.volume = this.state.volume;
        }
    }
    public componentDidUpdate(prevProps: Readonly<PlayerProviderProps>, prevState: Readonly<PlayerProviderStates>) {
        if (prevState.muted !== this.state.muted) {
            if (!this.state.muted) {
                this.setVolume(this.state.volume);
            }

            this.props.setConfig({
                muted: this.state.muted,
            });
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
        if (this.repeatMode !== RepeatMode.One) {
            this.seekForward();
        } else {
            this.seek(0);
            this.play();
        }
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
        switch (details.action) {
            case "nexttrack":
                this.seekForward();
                return;

            case "previoustrack":
                this.seekBackward();
                return;

            case "pause":
                this.pause();
                return;

            case "play":
                this.play();
                return;
        }
    };

    public playPlaylist(playlist: MinimalMusicFragment[], index = 0, shuffled = false) {
        playlist = [...playlist];
        if (shuffled) {
            playlist = _.shuffle(playlist);
        }

        this.setState({ playlist, playlistIndex: index }, () => {
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

        if (this.repeatMode === RepeatMode.None && (index < 0 || index >= playlist.length)) {
            return;
        }

        if (index < 0) {
            index = playlist.length - 1;
        } else if (index >= playlist.length) {
            index = 0;
        }

        this.setState({ playlistIndex: index }, () => {
            this.play();
        });
    }
    public seekForward() {
        this.seekPlaylist(this.state.playlistIndex + 1);
    }
    public seekBackward() {
        // check if audio position is elapsed 3 seconds
        const { current: audio } = this.audioRef;
        if (!audio) {
            return;
        }

        if (audio.currentTime > 2) {
            audio.currentTime = 0;
            return;
        }

        this.seekPlaylist(this.state.playlistIndex - 1);
    }
    public seek(position: number) {
        const { current: audio } = this.audioRef;
        if (!audio) {
            return;
        }

        audio.currentTime = position;
    }

    public setRepeatMode(mode: RepeatMode) {
        this.props.setConfig({ repeatMode: mode });
    }
    public toggleRepeatMode() {
        if (this.repeatMode === RepeatMode.None) {
            this.setRepeatMode(RepeatMode.All);
        } else if (this.repeatMode === RepeatMode.All) {
            this.setRepeatMode(RepeatMode.One);
        } else {
            this.setRepeatMode(RepeatMode.None);
        }
    }

    public shuffle() {
        // splice current music from playlist array and shuffle it.
        // and then insert it into playlist array at current index.

        const { playlist, playlistIndex } = this.state;
        if (!playlist) {
            return;
        }

        const newPlaylist = [...playlist];
        const currentMusic = newPlaylist.splice(playlistIndex, 1)[0];
        const shuffledPlaylist = _.shuffle(newPlaylist);
        shuffledPlaylist.splice(playlistIndex, 0, currentMusic);

        this.setState({ playlist: shuffledPlaylist });
    }

    public setVolume(volume: number, save = false) {
        const { current: audio } = this.audioRef;
        if (!audio) {
            return;
        }

        if (volume <= 0) {
            volume = 0;

            if (save) {
                this.setMuted(true);
            }
        }

        audio.volume = volume;
        if (save && volume) {
            this.setState({ volume });
            this.props.setConfig({
                volume,
            });
        }
    }
    public toggleMute() {
        const { current: audio } = this.audioRef;
        if (!audio) {
            return;
        }

        this.setState(prevState => ({ muted: !prevState.muted }));
    }
    public setMuted(muted: boolean) {
        this.setState({ muted });
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
        const { playing, playlist, playlistIndex, muted, volume } = this.state;
        const currentMusic = playlist?.[playlistIndex] ?? null;

        return (
            <PlayerContext.Provider
                value={{
                    ...this.contextValue,
                    playing,
                    playlist,
                    playlistIndex,
                    playingMusic: currentMusic,
                    repeatMode: this.repeatMode,
                    canSeekForward: this.canSeekForward,
                    canSeekBackward: this.canSeekBackward,
                    volume,
                    muted,
                }}
            >
                <audio
                    muted={muted}
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

export const PlayerProvider = withConfig(PlayerProviderImpl);
