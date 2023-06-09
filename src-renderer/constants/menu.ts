import { TFunction } from "i18next";

import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { MenuItem } from "@components/Menu";

import { MinimalPlaylistFragment } from "@queries";

interface Options {
    t: TFunction<"ns1", undefined, "ns1">;
    playlists: MinimalPlaylistFragment[];
    onNowPlayingClick(): void;
    onNewPlaylistClick(): void;
    onPlaylistClick(playlist: MinimalPlaylistFragment): void;
}

export function generateAddToPlaylistMenuItems({
    t,
    playlists,
    onPlaylistClick,
    onNewPlaylistClick,
    onNowPlayingClick,
}: Options): MenuItem[] {
    return [
        {
            id: "queue",
            label: t("common.nowPlaying"),
            icon: QueueMusicIcon,
            onClick: onNowPlayingClick,
        },
        "divider",
        {
            id: "create-new",
            label: t("common.newPlaylist"),
            icon: AddRoundedIcon,
            onClick: onNewPlaylistClick,
        },
        ...(playlists.map(playlist => ({
            id: `playlist.${playlist.id}`,
            label: playlist.name,
            icon: QueueMusicIcon,
            onClick: () => onPlaylistClick(playlist),
        })) || []),
    ];
}
