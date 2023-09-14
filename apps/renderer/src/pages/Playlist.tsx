import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { isNumericString } from "utils";

import { PlaylistPage } from "@components/Page/Playlist";
import { useLibrary } from "@components/Library/context";

export interface PlaylistProps {}

export function Playlist({}: PlaylistProps) {
    const library = useLibrary();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    if (!id || !isNumericString(id)) {
        throw new Error("Invalid playlist id");
    }

    const playlistId = parseInt(id);
    const playlist = library.usePlaylist(parseInt(id));
    const handleDelete = React.useCallback(async () => {
        if (!playlist) {
            return;
        }

        const deleted = await library.deletePlaylist(playlist);
        if (!deleted) {
            return;
        }

        navigate("/");
    }, [library, navigate, playlist]);

    return (
        <PlaylistPage
            playlistId={playlistId}
            onDelete={handleDelete}
            musics={playlist?.musics ?? []}
            title={playlist?.name ?? ""}
            loading={!playlist}
        />
    );
}
