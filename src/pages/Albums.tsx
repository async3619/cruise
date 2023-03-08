import React from "react";
import * as _ from "lodash";

import MusicsPage from "@components/Page/Musics";
import AlbumList from "@components/UI/AlbumList";

import usePlayer from "@player/usePlayer";
import { useApolloClient } from "@apollo/client";
import { AlbumMusicsDocument, AlbumMusicsQuery, AlbumMusicsQueryVariables, useAlbumsQuery } from "@queries";

import { Root } from "@pages/Albums.styles";

import { AlbumListItem } from "@utils/types";

export default function Albums() {
    const player = usePlayer();
    const client = useApolloClient();
    const { data } = useAlbumsQuery({
        fetchPolicy: "network-only",
    });

    const handlePlay = async (album: AlbumListItem) => {
        const { data } = await client.query<AlbumMusicsQuery, AlbumMusicsQueryVariables>({
            query: AlbumMusicsDocument,
            variables: {
                id: album.id,
            },
        });

        if (!data?.album) {
            throw new Error(`Failed to get musics of album: ${album.title}`);
        }

        const musics = _.orderBy(data.album.musics, m => m.track ?? m.id, "asc");
        await player.play(musics, musics[0]);
    };

    return (
        <MusicsPage title="Albums" player={player}>
            <Root>{data?.albums && <AlbumList onPlay={handlePlay} items={data.albums} />}</Root>
        </MusicsPage>
    );
}
