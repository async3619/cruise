import React from "react";
import { useTranslation } from "react-i18next";

import { Page } from "@components/Page";
import { Menu } from "@components/Menu";

export interface HomeProps {}

export function Home({}: HomeProps) {
    const { t } = useTranslation();

    return (
        <Page title={t("Home")}>
            <span>{t("Hello")}</span>
            <Menu
                items={[
                    {
                        id: "test",
                        label: "Test",
                    },
                    {
                        id: "test2",
                        label: "Test2",
                    },
                    {
                        id: "test3",
                        label: "Test3",
                    },
                ]}
            />
        </Page>
    );
}
