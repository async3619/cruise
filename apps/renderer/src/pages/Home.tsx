import React from "react";
import { useTranslation } from "react-i18next";

import { Page } from "@components/Page";

export function Home() {
    const { t } = useTranslation();

    return <Page title={t("pages.home")}>Hello World!</Page>;
}
