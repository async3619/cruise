import React from "react";
import { useParams } from "react-router-dom";

import AlbumPage from "@components/Page/Album";

import { useAlbumQuery } from "@queries";
import usePlayer from "@player/usePlayer";
import { PlayableMusic } from "@utils/types";

export default function Album() {
    const { albumId: albumIdData } = useParams<{ albumId: string }>();
    if (!albumIdData || !Number(albumIdData)) throw new Error("Invalid album id");

    const albumId = Number(albumIdData);
    const player = usePlayer();
    const { data, loading } = useAlbumQuery({
        variables: {
            id: albumId,
        },
    });

    const handlePlay = (item: PlayableMusic) => {
        if (!data?.album) return;

        player.play(data.album.musics, item);
    };

    const handlePlayAll = () => {
        if (!data?.album) return;

        player.play(data.album.musics, data.album.musics[0]);
    };

    const handleShuffleAll = () => {
        if (!data?.album) return;

        player.playShuffled(data.album.musics);
    };

    if (!loading && !data?.album) {
        throw new Error("Failed to get album");
    }

    return (
        <AlbumPage album={data?.album} onPlay={handlePlay} onPlayAll={handlePlayAll} onShuffleAll={handleShuffleAll} />
    );
}
