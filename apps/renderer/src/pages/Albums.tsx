import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "ui";

import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { Page } from "@components/Page";
import { useLibrary } from "@components/Library/context";
import { AlbumArtistList } from "@components/AlbumArtist/List";
import { usePlayer } from "@components/Player/context";
import { AlbumSelection, AlbumSelectionToolbar } from "@components/Selection";

import { MinimalAlbum } from "@utils/types";

export interface AlbumsProps {}

export function Albums({}: AlbumsProps) {
    const { t } = useTranslation();
    const library = useLibrary();
    const player = usePlayer();
    const { albums, loading } = library.useAlbums();

    const handleShuffleAll = React.useCallback(() => {
        if (!albums) {
            return;
        }

        player.playPlaylist(
            albums.flatMap(a => a.musics),
            0,
            true,
        );
    }, [albums, player]);

    const handlePlayAlbum = React.useCallback(
        (album: MinimalAlbum) => {
            player.playPlaylist(album.musics, 0, false);
        },
        [player],
    );

    return (
        <AlbumSelection items={albums}>
            <Page
                header={t("pages.albums")}
                loading={loading}
                toolbar={
                    <AlbumSelectionToolbar>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<ShuffleRoundedIcon />}
                            onClick={handleShuffleAll}
                        >
                            {t("common.shuffle-all")}
                        </Button>
                    </AlbumSelectionToolbar>
                }
            >
                <AlbumArtistList items={albums} onPlayAlbum={handlePlayAlbum} />
            </Page>
        </AlbumSelection>
    );
}
