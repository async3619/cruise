import RefreshIcon from "@mui/icons-material/Refresh";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

import { SettingsItem } from "@components/Settings/types";

export const LIBRARY_SETTINGS_ITEMS: SettingsItem[] = [
    {
        type: "path_list",
        pathType: "directory",
        id: "libraryDirectories",
        title: "Music Library Directories",
        icon: LibraryMusicIcon,
        button: {
            label: "Add Directory",
            icon: LibraryAddIcon,
        },
    },
    {
        type: "button",
        id: "rescanLibrary",
        title: "Rescan Library",
        description: "Rescan the music library to add new files.",
        button: {
            label: "Rescan",
            icon: RefreshIcon,
        },
    },
];
