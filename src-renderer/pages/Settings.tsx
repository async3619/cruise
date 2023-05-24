import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";

import { Stack } from "@mui/material";

import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";

import { Page } from "@components/Page";
import { ConfigGroup } from "@components/Config/Group";
import { useConfig } from "@components/Config/Provider";
import { createActionConfigItem, createConfigItem, createEnumConfigItem } from "@components/Config";

import { AppTheme, useScanMutation } from "@queries";

export interface SettingsProps {}

export function Settings({}: SettingsProps) {
    const { t } = useTranslation();
    const { config, setConfig, languages, languageMap } = useConfig();
    const languageEnum = React.useMemo(() => {
        if (!languages) {
            return {};
        }

        return _.chain(languages).keyBy("code").mapValues("code").value();
    }, [languages]);
    const [scan] = useScanMutation();

    const handleChange = async (key: string, value: any) => {
        if (!config) {
            return;
        }

        const newConfig = {
            ...config,
            [key]: value,
        };

        setConfig(newConfig);
    };

    if (!config || !languageMap) {
        return null;
    }

    return (
        <Page title={t("Settings")}>
            <Stack spacing={2}>
                <ConfigGroup
                    title={t("configs.library")}
                    items={[
                        createActionConfigItem({
                            type: "action",
                            name: "refreshLibrary",
                            action: {
                                type: "action",
                                label: t("configs.refreshLibrary.action"),
                                onClick: () => scan(),
                            },
                            label: t("configs.refreshLibrary.title"),
                            description: t("configs.refreshLibrary.description"),
                            icon: RefreshRoundedIcon,
                        }),
                        createConfigItem({
                            type: "path-list",
                            name: "libraryDirectories",
                            pathType: "directory",
                            label: t("configs.libraryDirectories.title"),
                            icon: FolderOpenRoundedIcon,
                            actionLabel: t("configs.libraryDirectories.action"),
                        }),
                    ]}
                    value={config}
                    onChange={handleChange}
                />
                <ConfigGroup
                    title={t("configs.personalization")}
                    items={[
                        createEnumConfigItem({
                            type: "enum",
                            label: t("configs.appTheme.title"),
                            name: "appTheme",
                            enum: AppTheme,
                            icon: ColorLensRoundedIcon,
                            enumLabels: {
                                [AppTheme.Light]: "밝게",
                                [AppTheme.Dark]: "어둡게",
                                [AppTheme.System]: "시스템 설정 사용",
                            },
                        }),
                        createEnumConfigItem({
                            type: "enum",
                            label: t("configs.language.title"),
                            name: "language",
                            enum: languageEnum,
                            icon: ColorLensRoundedIcon,
                            enumLabels: languageMap,
                        }),
                    ]}
                    value={config}
                    onChange={handleChange}
                />
            </Stack>
        </Page>
    );
}
