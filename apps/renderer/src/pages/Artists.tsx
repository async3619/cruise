import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "ui";

import { Page } from "@components/Page";
import { AlbumArtistList } from "@components/AlbumArtist/List";
import { ArtistSelection, ArtistSelectionToolbar } from "@components/Selection";
import { useLibrary } from "@components/Library/context";
import { usePlayer } from "@components/Player/context";

import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { FullArtist } from "@utils/types";

export interface ArtistsProps {}

export function Artists({}: ArtistsProps) {
    const { t } = useTranslation();
    const library = useLibrary();
    const player = usePlayer();
    const { artists, loading } = library.useArtists();

    const handleShuffleAll = React.useCallback(() => {
        if (!artists || artists.length === 0) {
            return;
        }

        player.playPlaylist(
            artists.flatMap(a => a.musics),
            0,
            true,
        );
    }, [artists, player]);
    const handlePlayItem = React.useCallback(
        (artist: FullArtist) => {
            player.playPlaylist(
                artist.albums.flatMap(a => a.musics),
                0,
            );
        },
        [player],
    );

    return (
        <ArtistSelection items={artists}>
            <Page
                header={t("pages.artists")}
                loading={loading}
                toolbar={
                    <ArtistSelectionToolbar>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<ShuffleRoundedIcon />}
                            onClick={handleShuffleAll}
                        >
                            {t("common.shuffle-all")}
                        </Button>
                    </ArtistSelectionToolbar>
                }
            >
                <AlbumArtistList type="artist" items={artists} onPlayItem={handlePlayItem} />
            </Page>
        </ArtistSelection>
    );
}
