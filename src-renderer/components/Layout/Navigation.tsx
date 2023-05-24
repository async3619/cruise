import React from "react";
import { useTranslation } from "react-i18next";

import { Stack } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";

import { Menu } from "@components/Menu";
import { Root } from "@components/Layout/Navigation.styles";

export interface NavigationProps {}

export function Navigation({}: NavigationProps) {
    const { t } = useTranslation();

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
                <Menu items={[]} title={t("Playlists")} />
            </Stack>
        </Root>
    );
}
