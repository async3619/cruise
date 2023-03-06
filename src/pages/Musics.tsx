import React from "react";

import Page from "@components/Page";
import MusicList from "@components/UI/MusicList";

import { useMusicsQuery } from "@queries";
import usePlayer from "@player/usePlayer";

import { Root } from "@pages/Musics.styles";

import { MusicListItem } from "@utils/types";

export default function Musics() {
    const { play, currentMusic } = usePlayer();
    const { data } = useMusicsQuery({
        fetchPolicy: "network-only",
    });

    const handlePlay = (item: MusicListItem) => {
        if (!data?.musics) {
            return;
        }

        play(data.musics, item);
    };

    return (
        <Page title="Musics">
            <Root>
                {data?.musics && <MusicList activeItem={currentMusic} onPlay={handlePlay} items={data.musics} />}
            </Root>
        </Page>
    );
}
