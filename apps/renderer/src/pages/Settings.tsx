import React from "react";
import { useTranslation } from "react-i18next";
import { ConfigList } from "ui";

import { CircularProgress } from "@mui/material";

import { useConfig } from "@components/Config";
import { Page } from "@components/Page";
import { ColorMode } from "@graphql/queries";

import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";

export function Settings() {
    const { t } = useTranslation();
    const { config, setConfig } = useConfig();

    return (
        <Page title={t("pages.settings")}>
            {!config && <CircularProgress />}
            {config && (
                <ConfigList
                    onChange={setConfig}
                    config={config}
                    items={[
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
                    ]}
                />
            )}
        </Page>
    );
}
