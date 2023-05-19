import React from "react";
import { useTranslation } from "react-i18next";

import { Stack } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded";

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
                            id: "library",
                            label: t("Library"),
                            icon: LibraryMusicRoundedIcon,
                            href: "/library",
                        },
                        {
                            id: "settings",
                            label: t("Settings"),
                            icon: SettingsRoundedIcon,
                            href: "/settings",
                        },
                    ]}
                />
                <Menu items={[]} title={t("Playlists")} />
            </Stack>
        </Root>
    );
}
