import React from "react";

import { Typography } from "@mui/material";

import SearchPage from "@components/Page/SearchPage";
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
        <SearchPage
            useQuery={useSearchArtistsQuery}
            query={params.query}
            title={`Artist search results for "${params.query}"`}
        >
            {({ search: { artists } }) => (
                <Section>
                    <SectionTitle>
                        <Typography fontWeight={800} variant="h6">
                            Results ({artists.length})
                        </Typography>
                    </SectionTitle>
                    <ArtistList items={artists} onPlay={handlePlayArtist} onClick={handleClickArtist} />
                </Section>
            )}
        </SearchPage>
    );
}
