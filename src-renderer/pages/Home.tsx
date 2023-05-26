import React from "react";
import { useTranslation } from "react-i18next";

import { Page } from "@components/Page";

export function Home() {
    const { t } = useTranslation();

    return (
        <Page title={t("Home")}>
            <span>{t("Hello")}</span>
        </Page>
    );
}
