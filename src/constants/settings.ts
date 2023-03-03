import { Folder20Regular, FolderAdd20Regular } from "@fluentui/react-icons";

import { SettingsItem } from "@components/Settings/types";

export const LIBRARY_SETTINGS_ITEMS: SettingsItem[] = [
    {
        type: "path_list",
        pathType: "directory",
        id: "libraryDirectories",
        title: "Music Library Directories",
        icon: Folder20Regular,
        button: {
            label: "Add Directory",
            icon: FolderAdd20Regular,
        },
    },
];
