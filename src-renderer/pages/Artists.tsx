import React from "react";
import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import { useLibrary } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";
import { Page } from "@components/Page";
import { Card } from "@components/Card";

import { MinimalArtistFragment } from "@queries";

export interface ArtistsProps {}

export function Artists({}: ArtistsProps) {
    const { t } = useTranslation();
    const library = useLibrary();
    const player = usePlayer();
    const { artists, loading } = library.useArtists();

    if (loading || !artists) {
        return <Page loading title={t("pageTitle.artists")} />;
    }

    const handleArtistPlay = (artist: MinimalArtistFragment) => {
        const allMusics = artist.leadAlbums.flatMap(album => album.musics);
        player.playPlaylist(allMusics, 0);
    };

    return (
        <Page title={t("pageTitle.artists")}>
            <Box display="flex" flexWrap="wrap">
                {artists.map(artist => (
                    <Card key={artist.id} item={artist} onPlay={handleArtistPlay} href={`/artists/${artist.id}`} />
                ))}
            </Box>
        </Page>
    );
}
