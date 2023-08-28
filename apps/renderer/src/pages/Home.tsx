import React from "react";
import { useTranslation } from "react-i18next";

import { Page } from "@components/Page";

export function Home() {
    const { t } = useTranslation();

    return <Page header={t("pages.home")}>Hello World!</Page>;
}
