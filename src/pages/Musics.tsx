import React from "react";

import Page from "@components/Page";
import MusicList from "@components/UI/MusicList";

import { useMusicsQuery } from "@queries";

import { Root } from "@pages/Musics.styles";

export default function Musics() {
    const { data } = useMusicsQuery({
        fetchPolicy: "network-only",
    });

    return (
        <Page title="Musics">
            <Root>{data?.musics && <MusicList items={data.musics} />}</Root>
        </Page>
    );
}
