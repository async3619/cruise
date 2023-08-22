import React from "react";
import { useTranslation } from "react-i18next";
import { ConfigList, ConfigListItem } from "ui";

import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";

import { useConfig } from "@components/Config";
import { Page } from "@components/Page";

import {
    ColorMode,
    ConfigDataFragment,
    useLibraryScanningStateChangedSubscription,
    useScanLibraryMutation,
} from "@graphql/queries";
import { Box, Stack, Typography } from "@mui/material";

type ItemTuple = [string, ConfigListItem<ConfigDataFragment>[]];

export function Settings() {
    const { t } = useTranslation();
    const { config, setConfig } = useConfig();
    const [libraryScanning, setLibraryScanning] = React.useState(false);
    const [scanLibrary] = useScanLibraryMutation();

    useLibraryScanningStateChangedSubscription({
        onData: ({ data: { data } }) => {
            if (!data) {
                return;
            }

            setLibraryScanning(data.libraryScanningStateChanged);
        },
    });

    const items = React.useMemo<ItemTuple[]>(() => {
        return [
            [
                t("settings.library.title"),
                [
                    {
                        type: "action",
                        icon: <CachedRoundedIcon />,
                        label: t("settings.scan-library.title"),
                        description: t("settings.scan-library.description"),
                        button: {
                            label: t("settings.scan-library.action"),
                            disabled: libraryScanning,
                        },
                        action: scanLibrary,
                    },
                ],
            ],
            [
                t("settings.personalization.title"),
                [
                    {
                        icon: <PaletteRoundedIcon />,
                        name: "colorMode",
                        type: "switch",
                        label: t("settings.color-mode.title"),
                        labels: {
                            [t("settings.color-mode.options.light")]: ColorMode.Light,
                            [t("settings.color-mode.options.dark")]: ColorMode.Dark,
                            [t("settings.color-mode.options.system")]: ColorMode.System,
                        },
                    },
                    {
                        icon: <TranslateRoundedIcon />,
                        name: "language",
                        type: "switch",
                        label: t("settings.language.title"),
                        labels: {
                            English: "en",
                            한국어: "ko",
                        },
                    },
                ],
            ],
        ];
    }, [libraryScanning, scanLibrary, t]);

    return (
        <Page title={t("pages.settings")}>
            <Stack spacing={2}>
                {items.map(([title, items]) => (
                    <Box key={title}>
                        <Typography variant="h6" fontSize="1rem" color="text.secondary" sx={{ mb: 1 }}>
                            {title}
                        </Typography>
                        <ConfigList onChange={setConfig} config={config} items={items} />
                    </Box>
                ))}
            </Stack>
        </Page>
    );
}
