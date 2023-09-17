import React from "react";
import { useTranslation } from "react-i18next";

import { Nullable } from "types";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { ButtonItem } from "@components/Page/ShrinkHeader";
import { usePlayer } from "@components/Player/context";
import { useLibrary } from "@components/Library/context";

import { MinimalAlbum } from "@utils/types";

export function useAlbumHeaderButtons(album: Nullable<MinimalAlbum>) {
    const { t } = useTranslation();
    const player = usePlayer();
    const library = useLibrary();

    const playAll = React.useCallback(
        (shuffle: boolean) => {
            if (!album) {
                return;
            }

            player.playPlaylist(album.musics, 0, shuffle);
        },
        [album, player],
    );

    const handleAddToPlaylist = React.useCallback(
        (playlistId?: number) => {
            if (!album) {
                return;
            }

            const musicIds = album.musics.map(music => music.id);
            if (!musicIds.length) {
                return;
            }

            if (!playlistId) {
                return library.createPlaylist(musicIds);
            } else {
                return library.addMusicsToPlaylist(playlistId, musicIds);
            }
        },
        [album, library],
    );

    const handlePlayAll = React.useCallback(() => {
        playAll(false);
    }, [playAll]);
    const handleShuffleAll = React.useCallback(() => {
        playAll(true);
    }, [playAll]);

    return React.useMemo<ButtonItem[]>(() => {
        return [
            {
                variant: "contained",
                size: "small",
                color: "primary",
                label: t("common.play-all"),
                startIcon: <PlayArrowRoundedIcon />,
                disabled: !album?.musics?.length,
                onClick: handlePlayAll,
            },
            {
                variant: "contained",
                size: "small",
                color: "inherit",
                label: t("common.shuffle-all"),
                startIcon: <ShuffleRoundedIcon />,
                disabled: !album?.musics?.length,
                onClick: handleShuffleAll,
            },
            {
                type: "add-button",
                variant: "contained",
                size: "small",
                color: "inherit",
                label: t("common.add"),
                startIcon: <AddRoundedIcon />,
                disabled: !album?.musics?.length,
                onClick: handleShuffleAll,
                onPlaylistSelected: handleAddToPlaylist,
                onPlaylistCreate: handleAddToPlaylist,
            },
        ];
    }, [t, album, handlePlayAll, handleShuffleAll, handleAddToPlaylist]);
}
