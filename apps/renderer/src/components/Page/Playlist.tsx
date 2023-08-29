import React from "react";
import { useTranslation } from "react-i18next";

import { Box, CircularProgress } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import { ButtonItem, ShrinkHeaderPage } from "@components/Page/ShrinkHeader";
import { MusicList } from "@components/MusicList";
import { usePlayer } from "@components/Player/context";

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
    const player = usePlayer();
    const albumArt = musics[0]?.albumArt;
    const tokens = [t("common.musicWithCount", { count: musics.length })];

    const handleClear = React.useCallback(() => {
        player.clearPlaylist();
    }, [player]);

    const buttons: ButtonItem[] = [
        {
            label: t("common.clear"),
            variant: "contained",
            size: "small",
            color: "inherit",
            startIcon: <DeleteRoundedIcon />,
            disabled: musics.length === 0,
            onClick: handleClear,
        },
    ];

    if (playlistId) {
        if (onDelete) {
            buttons.push({
                label: t("common.delete"),
                variant: "contained",
                size: "small",
                color: "inherit",
                startIcon: <ClearRoundedIcon />,
                onClick: onDelete,
            });
        }
    }

    return (
        <ShrinkHeaderPage
            albumArt={albumArt}
            title={title || t("common.now-playing")}
            subtitle={t("common.playlist")}
            tokens={tokens}
            buttons={buttons}
            loading={loading}
        >
            {!loading && <MusicList musics={musics} />}
            {loading && (
                <Box py={2} display="flex" justifyContent="center">
                    <CircularProgress size={36} />
                </Box>
            )}
        </ShrinkHeaderPage>
    );
}
