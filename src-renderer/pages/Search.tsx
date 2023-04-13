import React from "react";

import { Typography } from "@mui/material";

import Page from "@components/Page";
import MusicList from "@components/UI/MusicList";
import AlbumList from "@components/UI/AlbumList";
import ArtistList from "@components/UI/ArtistList";
import Button from "@components/UI/Button";

import { Root, Section, SectionTitle } from "@pages/Search.styles";

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

export default function Search({ client, params, navigate, player }: BasePageProps<{ query: string }>) {
    if (!params.query) {
        throw new Error("Query is not provided");
    }

    const { data } = useSearchQuery({
        variables: {
            query: params.query,
        },
    });

    if (!data) {
        return <Page title={`"${params.query}" Search Result`} />;
    }

    const {
        search: { musics, artists, albums },
    } = data;

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

    const handleMusicShowAllClick = () => {
        navigate(`/search/${params.query}/musics`);
    };
    const handleArtistShowAllClick = () => {
        navigate(`/search/${params.query}/artists`);
    };
    const handleAlbumShowAllClick = () => {
        navigate(`/search/${params.query}/albums`);
    };

    return (
        <Page title={`Search results of "${params.query}"`}>
            <Root>
                {musics.length > 0 && (
                    <Section>
                        <SectionTitle>
                            <Typography fontWeight={800} variant="h6">
                                Tracks ({musics.length})
                            </Typography>
                            {musics.length > 5 && (
                                <Button variant="text" color="primary" onClick={handleMusicShowAllClick}>
                                    Show All
                                </Button>
                            )}
                        </SectionTitle>
                        <MusicList items={musics.slice(0, 5)} onPlay={handlePlayMusic} />
                    </Section>
                )}
                {data.search.artists.length > 0 && (
                    <Section>
                        <SectionTitle>
                            <Typography fontWeight={800} variant="h6">
                                Artists ({artists.length})
                            </Typography>
                            {artists.length > 5 && (
                                <Button variant="text" color="primary" onClick={handleArtistShowAllClick}>
                                    Show All
                                </Button>
                            )}
                        </SectionTitle>
                        <ArtistList items={artists.slice(0, 5)} onPlay={handlePlayArtist} onClick={handleClickArtist} />
                    </Section>
                )}
                {data.search.albums.length > 0 && (
                    <Section>
                        <SectionTitle>
                            <Typography fontWeight={800} variant="h6">
                                Albums ({albums.length})
                            </Typography>
                            {albums.length > 5 && (
                                <Button variant="text" color="primary" onClick={handleAlbumShowAllClick}>
                                    Show All
                                </Button>
                            )}
                        </SectionTitle>
                        <AlbumList items={albums.slice(0, 5)} onPlay={handlePlayAlbum} onClick={handleClickAlbum} />
                    </Section>
                )}
            </Root>
        </Page>
    );
}
