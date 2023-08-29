import React from "react";
import { useTranslation } from "react-i18next";

import { Box, CircularProgress } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { ButtonItem, ShrinkHeaderPage } from "@components/Page/ShrinkHeader";
import { MusicList } from "@components/MusicList";
import { usePlayer } from "@components/Player/context";

import { MinimalMusic } from "@utils/types";

export interface PlaylistPageProps {
    musics: MinimalMusic[];
    title: string;
    loading?: boolean;
}

export function PlaylistPage({ musics, title, loading = false }: PlaylistPageProps) {
    const { t } = useTranslation();
    const player = usePlayer();
    const albumArt = musics[0]?.albumArt;
    const tokens = [t("common.musicWithCount", { count: musics.length })];

    const handleClear = React.useCallback(() => {
        player.clearPlaylist();
    }, [player]);

    const buttons = React.useMemo<ButtonItem[]>(() => {
        return [
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
    }, [musics, handleClear, t]);

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
