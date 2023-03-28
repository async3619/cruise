import React from "react";

import MusicsPage from "@components/Page/Musics";
import MusicList from "@components/UI/MusicList";

import { useMusicsQuery } from "@queries";

import { Root } from "@pages/Musics.styles";

import { BasePageProps, MusicListItem } from "@utils/types";

export default function Musics({ player }: BasePageProps) {
    const { currentMusic, play } = player;
    const { data } = useMusicsQuery();

    const handlePlay = (item: MusicListItem) => {
        if (!data?.musics) {
            return;
        }

        play(data.musics, item);
    };

    return (
        <MusicsPage title="Musics" player={player}>
            <Root>
                {data?.musics && <MusicList activeItem={currentMusic} onPlay={handlePlay} items={data.musics} />}
            </Root>
        </MusicsPage>
    );
}
