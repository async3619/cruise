import React from "react";
import { useTranslation } from "react-i18next";

import { Box, CircularProgress } from "@mui/material";

import { ShrinkHeaderPage } from "@components/Page/ShrinkHeader";
import { useHeaderButtons } from "@components/Page/Playlist.utils";
import { MusicSelection, MusicSelectionToolbar } from "@components/Selection";
import { useLibrary } from "@components/Library/context";
import { usePlayer } from "@components/Player/context";
import { MusicList } from "@components/MusicList";

import { MinimalMusic } from "@utils/types";

export interface PlaylistPageProps {
    musics: MinimalMusic[];
    title: string;
    loading?: boolean;
    playlistId?: number;
    onDelete?: () => void;
}

export function PlaylistPage({ musics, title, loading = false, playlistId, onDelete }: PlaylistPageProps) {
    const { t } = useTranslation();
    const albumArt = musics[0]?.albumArt;
    const tokens = [t("common.musicWithCount", { count: musics.length })];
    const buttons = useHeaderButtons(playlistId, onDelete, musics);
    const library = useLibrary();
    const player = usePlayer();

    const handleDelete = React.useCallback(
        async (indices: number[]) => {
            if (!playlistId) {
                return player.deletePlaylistItems(indices);
            } else {
                return library.deletePlaylistItems(playlistId, indices);
            }
        },
        [playlistId, player, library],
    );

    return (
        <MusicSelection items={musics}>
            <ShrinkHeaderPage
                albumArt={albumArt}
                title={title || t("common.now-playing")}
                subtitle={t("common.playlist")}
                tokens={tokens}
                buttons={buttons}
                loading={loading}
                toolbar={<MusicSelectionToolbar playable={!!playlistId} onDelete={handleDelete} />}
            >
                {!loading && <MusicList musics={musics} />}
                {loading && (
                    <Box py={2} display="flex" justifyContent="center">
                        <CircularProgress size={36} />
                    </Box>
                )}
            </ShrinkHeaderPage>
        </MusicSelection>
    );
}
