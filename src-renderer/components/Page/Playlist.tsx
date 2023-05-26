import _ from "lodash";

import React from "react";
import { useTranslation } from "react-i18next";

import { Box, CircularProgress, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useLibrary } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";
import { ButtonItem, ShrinkHeaderPage } from "@components/Page/ShrinkHeader";
import { MusicList } from "@components/MusicList";

import { MinimalMusicFragment, MinimalPlaylistFragment } from "@queries";

import { formatSeconds } from "@utils/formatTime";

export interface PlaylistPageProps {
    title: string;
    musics?: ReadonlyArray<MinimalMusicFragment> | null;
    playlist?: MinimalPlaylistFragment;
}

export function PlaylistPage({ title, playlist, musics }: PlaylistPageProps) {
    const { t } = useTranslation();
    const player = usePlayer();
    const library = useLibrary();

    let tokens: string[] = [];
    let children: React.ReactNode;
    let playable = false;
    let loaded = false;

    if (!musics) {
        children = (
            <Box py={4}>
                <CircularProgress size={36} />
            </Box>
        );
    } else {
        loaded = true;
        if (musics.length !== 0) {
            children = <MusicList items={musics} />;
        } else {
            playable = true;

            children = (
                <Box py={4}>
                    <Typography variant="body1" color="text.disabled" textAlign="center">
                        {t("emptyPlaylist")}
                    </Typography>
                </Box>
            );
        }

        const totalDuration = _.sumBy(musics, music => music.duration);
        tokens = [t("trackCount", { count: musics.length }), formatSeconds(totalDuration)];
    }

    const buttons: ButtonItem[] = [
        {
            label: t("playAll"),
            variant: "contained",
            color: "primary",
            startIcon: <PlayArrowRoundedIcon />,
            disabled: playable || !musics,
            onClick: () => musics && player.playPlaylist(musics, 0),
        },
        {
            label: t("shuffleAll"),
            variant: "contained",
            color: "inherit",
            startIcon: <ShuffleRoundedIcon />,
            disabled: playable || !musics,
            onClick: () => musics && player.playPlaylist(musics, 0, true),
        },
    ];

    if (playlist) {
        buttons.push(
            {
                label: t("rename"),
                variant: "contained",
                color: "inherit",
                startIcon: <EditRoundedIcon />,
                disabled: !loaded,
                onClick: () => library.renamePlaylist(playlist),
            },
            {
                label: t("delete"),
                variant: "contained",
                color: "inherit",
                startIcon: <DeleteRoundedIcon />,
                disabled: !loaded,
                onClick: () => library.deletePlaylist(playlist),
            },
        );
    }

    return (
        <ShrinkHeaderPage title={title} subtitle={t("Playlists")} tokens={tokens} buttons={buttons}>
            {children}
        </ShrinkHeaderPage>
    );
}
