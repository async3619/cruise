import React from "react";
import { useParams } from "react-router-dom";

import { isNumericString } from "utils";

import { PlaylistPage } from "@components/Page/Playlist";
import { useLibrary } from "@components/Library/context";

export interface PlaylistProps {}

export function Playlist({}: PlaylistProps) {
    const library = useLibrary();
    const { id } = useParams<{ id: string }>();
    if (!id || !isNumericString(id)) {
        throw new Error("Invalid playlist id");
    }

    const playlist = library.usePlaylist(parseInt(id));

    return <PlaylistPage musics={playlist?.musics ?? []} title={playlist?.name ?? ""} loading={!playlist} />;
}
