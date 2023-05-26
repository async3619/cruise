import React from "react";
import { useParams } from "react-router-dom";

import { useLibrary, usePlaylist } from "@components/Library/Provider";
import { PlaylistPage } from "@components/Page/Playlist";

export function Playlist() {
    const library = useLibrary();
    const { id } = useParams<{ id: string }>();

    if (!id) {
        throw new Error("id is required");
    }

    const idValue = parseInt(id, 10);
    if (isNaN(idValue)) {
        throw new Error("id is not a number");
    }

    const playlist = usePlaylist(idValue);
    if (!playlist) {
        return null;
    }

    const { playlist: playlistData } = library.usePlaylist(playlist.id);

    return <PlaylistPage title={playlist.name} playlist={playlist} musics={playlistData?.musics} />;
}
