import React from "react";
import { useTranslation } from "react-i18next";

import { Page } from "@components/Page";

export interface SearchProps {}

export function Search({}: SearchProps) {
    const { t } = useTranslation();

    return (
        <Page title={t("Search")}>
            <span>Search</span>
        </Page>
    );
}
