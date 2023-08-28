import React from "react";

import { usePlayer } from "@components/Player/context";
import { PlaylistPage } from "@components/Page/Playlist";

export interface NowPlayingProps {}

export function NowPlaying({}: NowPlayingProps) {
    const { playlist } = usePlayer();

    return <PlaylistPage musics={playlist} />;
}
