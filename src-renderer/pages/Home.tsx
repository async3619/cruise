import React from "react";
import { useTranslation } from "react-i18next";

import { Box, CircularProgress, Stack } from "@mui/material";

import { Page } from "@components/Page";
import { useLibrary } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";
import { ContentSection } from "@components/ContentSection";
import { CardList } from "@components/CardList";
import { MusicList } from "@components/MusicList";

import { MinimalAlbumFragment, MinimalArtistFragment } from "@queries";
import { isAlbum } from "@utils/media";

export function Home() {
    const { t } = useTranslation();
    const library = useLibrary();
    const player = usePlayer();
    const recentlyAddedAlbums = library.useRecentlyAddedAlbums(15);
    const playingLogs = library.usePlayingLogs(15);
    const handlePlay = React.useCallback(
        (item: MinimalAlbumFragment | MinimalArtistFragment) => {
            if (isAlbum(item)) {
                const musics = item.musics;
                if (musics.length <= 0) {
                    return;
                }

                player.playPlaylist(musics, 0);
            }
        },
        [player],
    );

    if (!recentlyAddedAlbums.items || recentlyAddedAlbums.loading || playingLogs.loading || !playingLogs.items) {
        return (
            <Page title={t("Home")}>
                <Box p={4} display="flex" justifyContent="center">
                    <CircularProgress size={36} />
                </Box>
            </Page>
        );
    }

    const musicItems = playingLogs.items.map(log => log.music);

    return (
        <Page title={t("Home")}>
            <Stack spacing={3}>
                {musicItems.length > 0 && (
                    <ContentSection title={t("sectionTitle.recentlyPlayed")}>
                        <MusicList maxItems={5} items={musicItems} />
                    </ContentSection>
                )}
                {recentlyAddedAlbums.items.length > 0 && (
                    <ContentSection title={t("sectionTitle.recentlyAddedAlbums")}>
                        <CardList direction="horizontal" items={recentlyAddedAlbums.items} onPlay={handlePlay} />
                    </ContentSection>
                )}
            </Stack>
        </Page>
    );
}
