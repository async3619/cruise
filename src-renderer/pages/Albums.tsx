import React from "react";
import { useTranslation } from "react-i18next";

import { Page } from "@components/Page";

export interface AlbumsProps {}

export function Albums({}: AlbumsProps) {
    const { t } = useTranslation();

    return (
        <Page title={t("pageTitle.albums")}>
            <span>Albums</span>
        </Page>
    );
}
