import React from "react";
import { useTranslation } from "react-i18next";

import { Page } from "@components/Page";

export interface LibraryProps {}

export function Library({}: LibraryProps) {
    const { t } = useTranslation();

    return (
        <Page title={t("Library")}>
            <span>Library</span>
        </Page>
    );
}
