import React from "react";

import { Page } from "@components/Page";
import { useTranslation } from "react-i18next";

export interface SettingsProps {}

export function Settings({}: SettingsProps) {
    const { t } = useTranslation();

    return (
        <Page title={t("Settings")}>
            <span>Settings</span>
        </Page>
    );
}
