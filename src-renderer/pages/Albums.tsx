import React from "react";
import * as _ from "lodash";

import MusicsPage from "@components/Page/Musics";
import AlbumList from "@components/UI/AlbumList";

import { useAlbumsQuery } from "@queries";

import { Root } from "@pages/Albums.styles";

import { AlbumListItem, BasePageProps } from "@utils/types";

export default function Albums({ player, navigate }: BasePageProps) {
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
