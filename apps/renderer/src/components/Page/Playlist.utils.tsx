/* eslint-disable react-hooks/rules-of-hooks */
import { Nullable } from "types";
import { MenuItem } from "ui";

import React from "react";
import { useTranslation } from "react-i18next";

import { ButtonItem } from "@components/Page/ShrinkHeader";
import { usePlayer } from "@components/Player/context";
import { useLibrary } from "@components/Library/context";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { MinimalMusic } from "@utils/types";

export function useHeaderButtons(playlistId: Nullable<number>, onDelete: Nullable<() => void>, musics: MinimalMusic[]) {
    const { t } = useTranslation();
    const player = usePlayer();
    const library = useLibrary();
    const playlists = library.usePlaylists();
    const musicIds = React.useMemo(() => musics.map(music => music.id), [musics]);
    const playlist = React.useMemo(
        () => playlists.find(playlist => playlist.id === playlistId),
        [playlists, playlistId],
    );

    const handleCreatePlaylist = React.useCallback(async () => {
        await library.createPlaylist(musicIds);
    }, [musicIds, library]);

    const handleClear = React.useCallback(() => {
        if (playlist) {
            library.clearPlaylist(playlist);
        } else {
            player.clearPlaylist();
        }
    }, [library, player, playlist]);

    const handleRename = React.useCallback(() => {
        if (!playlist) {
            return;
        }

        return library.renamePlaylist(playlist);
    }, [library, playlist]);

    const handlePlayAll = React.useCallback(() => {
        player.playPlaylist(musics, 0);
    }, [musics, player]);

    const handleShuffleAll = React.useCallback(() => {
        player.playPlaylist(musics, 0, true);
    }, [musics, player]);

    return React.useMemo(() => {
        const menuItems: MenuItem[] = [];
        if (playlists.length > 0) {
            menuItems.push({ type: "divider" });

            for (const playlist of playlists) {
                menuItems.push({
                    type: "button",
                    id: `add-to-playlist-${playlist.id}`,
                    label: playlist.name,
                    icon: <QueueMusicRoundedIcon />,
                    onClick: () => library.addMusicsToPlaylist(playlist.id, musicIds),
                });
            }
        }

        let buttons: ButtonItem[] = [
            {
                label: t("common.clear"),
                variant: "contained",
                size: "small",
                color: "inherit",
                startIcon: <DeleteRoundedIcon />,
                disabled: musics.length === 0,
                onClick: handleClear,
            },
            {
                label: t("common.add"),
                variant: "contained",
                size: "small",
                color: "inherit",
                disabled: musics.length === 0,
                startIcon: <AddRoundedIcon />,
                menuItems: [
                    {
                        type: "button",
                        id: "add-to-playlist",
                        icon: <AddRoundedIcon />,
                        label: t("playlist.create.title"),
                        onClick: handleCreatePlaylist,
                    },
                    ...menuItems,
                ],
            },
        ];

        if (playlistId && onDelete) {
            buttons = [
                {
                    label: t("common.play-all"),
                    variant: "contained",
                    size: "small",
                    color: "primary",
                    startIcon: <PlayArrowRoundedIcon />,
                    disabled: musics.length === 0,
                    onClick: handlePlayAll,
                },
                {
                    label: t("common.shuffle-all"),
                    variant: "contained",
                    size: "small",
                    color: "inherit",
                    startIcon: <ShuffleRoundedIcon />,
                    disabled: musics.length === 0,
                    onClick: handleShuffleAll,
                },
                ...buttons,
                {
                    label: t("common.delete"),
                    variant: "contained",
                    size: "small",
                    color: "inherit",
                    startIcon: <ClearRoundedIcon />,
                    onClick: onDelete,
                },
                {
                    label: t("common.rename"),
                    variant: "contained",
                    size: "small",
                    color: "inherit",
                    startIcon: <EditRoundedIcon />,
                    onClick: handleRename,
                },
            ];
        }

        return buttons;
    }, [
        playlists,
        t,
        musics.length,
        handleClear,
        handleCreatePlaylist,
        playlistId,
        onDelete,
        library,
        musicIds,
        handlePlayAll,
        handleShuffleAll,
        handleRename,
    ]);
}
