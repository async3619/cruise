import { Home20Regular, MusicNote220Regular, Settings20Regular } from "@fluentui/react-icons";

import { ListItemType } from "@components/List/index.types";

export const NAVIGATION_ITEMS: ListItemType[] = [
    {
        id: "/",
        label: "Home",
        icon: Home20Regular,
    },
    "separator",
    {
        id: "/music",
        label: "Music",
        icon: MusicNote220Regular,
    },
    "gap",
    {
        id: "/settings",
        label: "Settings",
        icon: Settings20Regular,
    },
];
