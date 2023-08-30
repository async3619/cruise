/* eslint-disable react-hooks/rules-of-hooks */
import { Nullable } from "types";
import { DialogActionType, InputTextDialog, MenuItem, useDialog } from "ui";

import React from "react";
import { useTranslation } from "react-i18next";

import { ButtonItem } from "@components/Page/ShrinkHeader";
import { usePlayer } from "@components/Player/context";
import { useLibrary } from "@components/Library/context";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";

import { MinimalMusic } from "@utils/types";
import { z } from "zod";

export function useHeaderButtons(playlistId: Nullable<number>, onDelete: Nullable<() => void>, musics: MinimalMusic[]) {
    const { t } = useTranslation();
    const player = usePlayer();
    const library = useLibrary();
    const dialog = useDialog();
    const playlists = library.usePlaylists();
    const addMusicsToPlaylist = library.useAddMusicToPlaylist();
    const createPlaylist = library.useCreatePlaylist();
    const musicIds = React.useMemo(() => musics.map(music => music.id), [musics]);

    const handleCreatePlaylist = React.useCallback(async () => {
        const result = await dialog.openDialog(InputTextDialog, {
            title: t("playlist.create.title"),
            description: t("playlist.create.description"),
            placeholder: t("playlist.create.placeholder"),
            positiveLabel: t("common.create"),
            negativeLabel: t("common.cancel"),
            validationSchema: z
                .string()
                .nonempty(t("playlist.create.errors.title-required"))
                .max(20, t("playlist.create.errors.title-too-long")),
        });

        if (result.type !== DialogActionType.Submit) {
            return;
        }

        await createPlaylist(result.value, musicIds);
    }, [dialog, createPlaylist, t, musicIds]);

    const handleClear = React.useCallback(() => {
        player.clearPlaylist();
    }, [player]);

    return React.useMemo(() => {
        const menuItems: MenuItem[] = [
            {
                type: "button",
                id: "add-to-playlist",
                icon: <AddRoundedIcon />,
                label: t("playlist.create.title"),
                onClick: handleCreatePlaylist,
            },
        ];

        if (playlists.length > 0) {
            menuItems.push({ type: "divider" });

            for (const playlist of playlists) {
                menuItems.push({
                    type: "button",
                    id: `add-to-playlist-${playlist.id}`,
                    label: playlist.name,
                    icon: <QueueMusicRoundedIcon />,
                    onClick: () => addMusicsToPlaylist(playlist.id, musicIds),
                });
            }
        }

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
            {
                label: t("common.add"),
                variant: "contained",
                size: "small",
                color: "inherit",
                disabled: musics.length === 0,
                startIcon: <AddRoundedIcon />,
                menuItems,
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

        return buttons;
    }, [t, handleCreatePlaylist, playlists, musics, handleClear, playlistId, addMusicsToPlaylist, musicIds, onDelete]);
}
