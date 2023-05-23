import React from "react";
import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import { Page } from "@components/Page";
import { Card } from "@components/Card";
import { useLibrary } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";

import { MinimalAlbumFragment } from "@queries";

export interface AlbumsProps {}

export function Albums({}: AlbumsProps) {
    const { t } = useTranslation();
    const library = useLibrary();
    const player = usePlayer();
    const { albums, loading } = library.useAlbums();

    if (loading || !albums) {
        return <Page loading title={t("pageTitle.albums")} />;
    }

    const handleAlbumPlay = (album: MinimalAlbumFragment) => {
        player.playPlaylist(album.musics, 0);
    };

    return (
        <Page title={t("pageTitle.albums")}>
            <Box display="flex" flexWrap="wrap">
                {albums.map(album => (
                    <Card key={album.id} item={album} onPlay={handleAlbumPlay} />
                ))}
            </Box>
        </Page>
    );
}
