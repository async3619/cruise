import React from "react";

import ArtistList from "@components/UI/ArtistList";
import MusicsPage from "@components/Page/Musics";

import usePlayer from "@player/usePlayer";

import {
    ArtistAlbumMusicsDocument,
    ArtistAlbumMusicsQuery,
    ArtistAlbumMusicsQueryVariables,
    useArtistsQuery,
} from "@queries";
import { useApolloClient } from "@apollo/client";

import { ArtistListItem as ArtistListItemType } from "@utils/types";

import { Root } from "@pages/Artists.styles";

export default function Artists() {
    const player = usePlayer();
    const client = useApolloClient();
    const { data } = useArtistsQuery({
        fetchPolicy: "network-only",
    });

    const handlePlay = async (item: ArtistListItemType) => {
        const { data } = await client.query<ArtistAlbumMusicsQuery, ArtistAlbumMusicsQueryVariables>({
            query: ArtistAlbumMusicsDocument,
            variables: {
                artistId: item.id,
            },
        });

        if (!data?.artist) {
            //TODO: Throw error
            return;
        }

        const musics = data.artist.albums.flatMap(album => album.musics);
        await player.play(musics, musics[0]);
    };

    return (
        <MusicsPage title="Artists" player={player}>
            <Root>{data?.artists && <ArtistList items={data.artists} onPlay={handlePlay} />}</Root>
        </MusicsPage>
    );
}
