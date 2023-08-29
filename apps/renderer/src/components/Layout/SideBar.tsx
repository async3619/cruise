import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Scrollbars } from "rc-scrollbars";
import { DialogActionType, Menu, MenuItem, useDialog, InputTextDialog, useToast } from "ui";
import { z } from "zod";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { ScrollbarThumb } from "@components/ScrollbarThumb";
import { Content, Root } from "@components/Layout/SideBar.styles";
import { useLibrary } from "@components/Library/context";

export function SideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dialog = useDialog();
    const library = useLibrary();
    const toast = useToast();
    const playlists = library.usePlaylists();

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
            ...playlists.map<MenuItem>(playlist => ({
                type: "button",
                id: `/playlists/${playlist.id}`,
                label: playlist.name,
                icon: <QueueMusicRoundedIcon />,
            })),
            {
                type: "button",
                id: "create-playlist",
                label: t("playlist.create.title"),
                icon: <AddRoundedIcon />,
            },
        ];
    }, [playlists, t]);

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

        await toast.doWork({
            work: () => library.createPlaylist(result.value, []),
            loading: true,
            persist: true,
            messages: {
                pending: t("playlist.create.pending"),
                success: t("playlist.create.success"),
                error: t("playlist.create.error"),
            },
            action: id => ({
                label: t("common.open"),
                onClick: () => navigate(`/playlists/${id}`),
            }),
        });
    }, [dialog, t, toast, library, navigate]);

    const handleClick = React.useCallback(
        (item: MenuItem) => {
            if (item.type !== "button") {
                return;
            }

            if (!item.id.startsWith("/")) {
                if (item.id === "create-playlist") {
                    handleCreatePlaylist();
                }

                return;
            }

            navigate(item.id);
        },
        [navigate, handleCreatePlaylist],
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
