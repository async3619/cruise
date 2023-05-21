import React from "react";
import { useTranslation } from "react-i18next";

import { Page } from "@components/Page";

export interface ArtistsProps {}

export function Artists({}: ArtistsProps) {
    const { t } = useTranslation();

    return (
        <Page title={t("pageTitle.artists")}>
            <span>Artists</span>
        </Page>
    );
}
