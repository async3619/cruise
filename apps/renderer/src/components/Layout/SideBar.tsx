import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Scrollbars } from "rc-scrollbars";
import { Menu, MenuItem } from "ui";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";

import { ScrollbarThumb } from "@components/ScrollbarThumb";
import { Content, Root } from "@components/Layout/SideBar.styles";

export function SideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const navigationItems = React.useMemo<MenuItem[]>(() => {
        return [
            {
                id: "/",
                type: "button",
                label: t("pages.home"),
                icon: <HomeRoundedIcon />,
            },
            {
                id: "/settings",
                type: "button",
                label: t("pages.settings"),
                icon: <SettingsRoundedIcon />,
            },
            {
                type: "label",
                label: t("common.library"),
            },
            {
                id: "/library/musics",
                type: "button",
                label: t("pages.musics"),
                icon: <MusicNoteRoundedIcon />,
            },
            {
                type: "label",
                label: t("common.playlist"),
            },
            {
                type: "button",
                id: "/playlists/now-playing",
                label: t("common.now-playing"),
                icon: <QueueMusicRoundedIcon />,
            },
        ];
    }, [t]);

    const handleClick = React.useCallback(
        (item: MenuItem) => {
            if (item.type !== "button") {
                return;
            }

            navigate(item.id);
        },
        [navigate],
    );

    return (
        <Root>
            <Scrollbars
                autoHide
                renderView={props => <Content {...props} />}
                renderThumbVertical={props => <ScrollbarThumb {...props} />}
            >
                <Menu items={navigationItems} selectedId={location.pathname} onClick={handleClick} />
            </Scrollbars>
        </Root>
    );
}
