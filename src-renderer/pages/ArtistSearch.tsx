import React from "react";

import { Typography } from "@mui/material";

import Page from "@components/Page";
import ArtistList from "@components/UI/ArtistList";

import { Section, SectionTitle } from "@pages/Search.styles";

import { ArtistListItem as ArtistListItemType, BasePageProps } from "@utils/types";

import {
    ArtistAlbumMusicsDocument,
    ArtistAlbumMusicsQuery,
    ArtistAlbumMusicsQueryVariables,
    useSearchArtistsQuery,
} from "@queries";

export default function ArtistSearch({ params, player, client, navigate }: BasePageProps<{ query: string }>) {
    if (!params.query) {
        throw new Error("Query is not provided");
    }

    const { data } = useSearchArtistsQuery({
        variables: {
            query: params.query,
        },
    });

    if (!data) {
        return <Page title={`"${params.query}" Search Result`} />;
    }

    const {
        search: { artists },
    } = data;

    const handlePlayArtist = async (item: ArtistListItemType) => {
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
    const handleClickArtist = (item: ArtistListItemType) => {
        navigate(`/artists/${item.id}`);
    };

    return (
        <Page title={`Artist search results of "${params.query}"`}>
            <Section>
                <SectionTitle>
                    <Typography fontWeight={800} variant="h6">
                        Results ({artists.length})
                    </Typography>
                </SectionTitle>
                <ArtistList items={artists} onPlay={handlePlayArtist} onClick={handleClickArtist} />
            </Section>
        </Page>
    );
}
