import React from "react";
import { useTranslation } from "react-i18next";

import { Button, ButtonProps, MenuItem } from "ui";

import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { useLibrary } from "@components/Library/context";

export interface AddButtonProps extends Omit<ButtonProps, "menuItems"> {
    onPlaylistCreate(): void;
    onPlaylistSelected(playlistId: number): void;
}

export function AddButton({ onPlaylistCreate, onPlaylistSelected, ...rest }: AddButtonProps) {
    const library = useLibrary();
    const playlists = library.usePlaylists();
    const { t } = useTranslation();

    const menuItems = React.useMemo<MenuItem[]>(() => {
        const result: MenuItem[] = [
            {
                type: "button",
                id: "add-to-playlist",
                icon: <AddRoundedIcon />,
                label: t("playlist.create.title"),
                onClick: onPlaylistCreate,
            },
        ];

        if (playlists.length > 0) {
            result.push({
                type: "divider",
            });
        }

        result.push(
            ...playlists.map<MenuItem>(playlist => ({
                type: "button",
                label: playlist.name,
                id: playlist.id.toString(),
                icon: <QueueMusicRoundedIcon />,
                onClick: () => {
                    onPlaylistSelected(playlist.id);
                },
            })),
        );

        return result;
    }, [onPlaylistCreate, onPlaylistSelected, playlists, t]);

    return <Button {...rest} menuItems={menuItems} />;
}
