import { z } from "zod";

import React from "react";
import { useTranslation } from "react-i18next";

import { Stack } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { Menu } from "@components/Menu";
import { useDialog } from "@components/Dialog/Provider";
import { DialogActionType } from "@components/Dialog/types";
import { InputTextDialog } from "@components/Dialog/InputTextDialog";

import { useLibrary } from "@components/Library/Provider";

import { Root } from "@components/Layout/Navigation.styles";

export interface NavigationProps {}

export function Navigation({}: NavigationProps) {
    const { t } = useTranslation();
    const { openDialog } = useDialog();
    const library = useLibrary();
    const { playlists, create: createPlaylist } = library.usePlaylists();

    const handleCreatePlaylist = React.useCallback(async () => {
        const data = await openDialog(InputTextDialog, {
            title: t("dialog.createPlaylist.title"),
            content: t("dialog.createPlaylist.content"),
            validationSchema: z.string().nonempty(t("dialog.createPlaylist.validation.empty")),
        });

        if (data.type !== DialogActionType.Submit) {
            return;
        }

        await createPlaylist({
            variables: {
                input: {
                    name: data.value,
                },
            },
        });
    }, [openDialog, t, createPlaylist]);

    const playlistItems = playlists ?? [];

    return (
        <Root>
            <Stack spacing={2}>
                <Menu
                    items={[
                        {
                            id: "home",
                            label: t("Home"),
                            icon: HomeRoundedIcon,
                            href: "/",
                        },
                        {
                            id: "search",
                            label: t("Search"),
                            icon: SearchRoundedIcon,
                            href: "/search",
                        },
                        {
                            id: "settings",
                            label: t("Settings"),
                            icon: SettingsRoundedIcon,
                            href: "/settings",
                        },
                    ]}
                />
                <Menu
                    items={[
                        {
                            id: "musics",
                            label: t("pageTitle.musics"),
                            icon: MusicNoteIcon,
                            href: "/musics",
                        },
                        {
                            id: "artists",
                            label: t("pageTitle.artists"),
                            icon: Person2RoundedIcon,
                            href: "/artists",
                            hrefAliases: ["/artists"],
                        },
                        {
                            id: "albums",
                            label: t("pageTitle.albums"),
                            icon: AlbumRoundedIcon,
                            href: "/albums",
                            hrefAliases: ["/albums/"],
                        },
                    ]}
                    title={t("Library")}
                />
                <Menu
                    items={[
                        {
                            id: "playlists.nowPlaying",
                            label: t("pageTitle.nowPlaying"),
                            icon: QueueMusicIcon,
                            href: "/playlists",
                        },
                        ...playlistItems.map(playlist => ({
                            id: `playlists.${playlist.id}`,
                            label: playlist.name,
                            icon: QueueMusicIcon,
                            href: `/playlists/${playlist.id}`,
                        })),
                        {
                            id: "playlists.add",
                            label: t("pageTitle.newPlaylist"),
                            icon: AddRoundedIcon,
                            onClick: handleCreatePlaylist,
                        },
                    ]}
                    title={t("Playlists")}
                />
            </Stack>
        </Root>
    );
}
