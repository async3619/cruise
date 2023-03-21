import React from "react";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash";

import MusicsPage from "@components/Page/Musics";
import AlbumList from "@components/UI/AlbumList";

import usePlayer from "@player/usePlayer";
import { useAlbumsQuery } from "@queries";

import { Root } from "@pages/Albums.styles";

import { AlbumListItem } from "@utils/types";

export default function Albums() {
    const player = usePlayer();
    const navigate = useNavigate();
    const { data } = useAlbumsQuery();

    const handlePlay = async (album: AlbumListItem) => {
        const musics = _.orderBy(album.musics, m => m.track ?? m.id, "asc");
        await player.play(musics, musics[0]);
    };

    const handleClick = (album: AlbumListItem) => {
        navigate(`/albums/${album.id}`);
    };

    return (
        <MusicsPage title="Albums" player={player}>
            <Root>{data?.albums && <AlbumList onClick={handleClick} onPlay={handlePlay} items={data.albums} />}</Root>
        </MusicsPage>
    );
}
