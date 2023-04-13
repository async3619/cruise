import React from "react";

import { Typography } from "@mui/material";

import SearchPage from "@components/Page/SearchPage";
import MusicList from "@components/UI/MusicList";
import AlbumList from "@components/UI/AlbumList";
import LinkButton from "@components/UI/LinkButton";
import ArtistList from "@components/UI/ArtistList";

import {
    ArtistAlbumMusicsDocument,
    ArtistAlbumMusicsQuery,
    ArtistAlbumMusicsQueryVariables,
    useSearchQuery,
} from "@queries";

import {
    AlbumListItem as AlbumListItemType,
    ArtistListItem as ArtistListItemType,
    BasePageProps,
    MusicListItem,
} from "@utils/types";

import { Root, Section, SectionTitle } from "@pages/Search.styles";

export default function Search({ client, params, navigate, player }: BasePageProps<{ query: string }>) {
    if (!params.query) {
        throw new Error("Query is not provided");
    }

    const handlePlayMusic = (item: MusicListItem) => {
        player.play([item], item);
    };
    const handlePlayAlbum = (item: AlbumListItemType) => {
        player.play(item.musics, item.musics[0]);
    };
    const handleClickAlbum = (item: AlbumListItemType) => {
        navigate(`/albums/${item.id}`);
    };
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
        <SearchPage useQuery={useSearchQuery} query={params.query}>
            {({ search: { musics, artists, albums } }) => (
                <Root>
                    {musics.length > 0 && (
                        <Section>
                            <SectionTitle>
                                <Typography variant="h6" fontWeight={700}>
                                    Musics ({musics.length})
                                </Typography>
                                {musics.length > 5 && (
                                    <LinkButton href={`/search/${params.query}/musics`} variant="text" color="primary">
                                        Show All
                                    </LinkButton>
                                )}
                            </SectionTitle>
                            <MusicList items={musics.slice(0, 5)} onPlay={handlePlayMusic} />
                        </Section>
                    )}
                    {albums.length > 0 && (
                        <Section>
                            <SectionTitle>
                                <Typography variant="h6" fontWeight={700}>
                                    Albums ({albums.length})
                                </Typography>
                                {albums.length > 5 && (
                                    <LinkButton href={`/search/${params.query}/albums`} variant="text" color="primary">
                                        Show All
                                    </LinkButton>
                                )}
                            </SectionTitle>
                            <AlbumList items={albums.slice(0, 5)} onPlay={handlePlayAlbum} onClick={handleClickAlbum} />
                        </Section>
                    )}
                    {artists.length > 0 && (
                        <Section>
                            <SectionTitle>
                                <Typography variant="h6" fontWeight={700}>
                                    Artists ({artists.length})
                                </Typography>
                                {artists.length > 5 && (
                                    <LinkButton href={`/search/${params.query}/artists`} variant="text" color="primary">
                                        Show All
                                    </LinkButton>
                                )}
                            </SectionTitle>
                            <ArtistList
                                items={artists.slice(0, 5)}
                                onPlay={handlePlayArtist}
                                onClick={handleClickArtist}
                            />
                        </Section>
                    )}
                </Root>
            )}
        </SearchPage>
    );
}
