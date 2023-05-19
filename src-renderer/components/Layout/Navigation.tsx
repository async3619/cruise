import React from "react";

import { Stack } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded";

import { Menu } from "@components/Menu";
import { Root } from "@components/Layout/Navigation.styles";

export interface NavigationProps {}

export function Navigation({}: NavigationProps) {
    return (
        <Root>
            <Stack spacing={2}>
                <Menu
                    items={[
                        {
                            id: "home",
                            label: "Home",
                            icon: HomeRoundedIcon,
                            href: "/",
                        },
                        {
                            id: "search",
                            label: "Search",
                            icon: SearchRoundedIcon,
                            href: "/search",
                        },
                        {
                            id: "library",
                            label: "Library",
                            icon: LibraryMusicRoundedIcon,
                            href: "/library",
                        },
                        {
                            id: "settings",
                            label: "Settings",
                            icon: SettingsRoundedIcon,
                            href: "/settings",
                        },
                    ]}
                />
                <Menu items={[]} title="Playlists" />
            </Stack>
        </Root>
    );
}
