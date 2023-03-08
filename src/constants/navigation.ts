import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import { ListItemType } from "@components/List/index.types";

export const NAVIGATION_ITEMS: ListItemType[] = [
    {
        id: "/",
        label: "Home",
        icon: HomeRoundedIcon,
    },
    "separator",
    {
        id: "/musics",
        label: "Musics",
        icon: MusicNoteRoundedIcon,
    },
    {
        id: "/albums",
        label: "Albums",
        icon: AlbumRoundedIcon,
    },
    "gap",
    {
        id: "/settings",
        label: "Settings",
        icon: SettingsRoundedIcon,
    },
];
