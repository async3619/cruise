import React from "react";
import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import { Page } from "@components/Page";
import { CollageView } from "@components/ui/CollageView";

export function Home() {
    const { t } = useTranslation();

    return (
        <Page title={t("Home")}>
            <span>{t("Hello")}</span>
            <Box maxWidth={240} mt={4}>
                <CollageView
                    src={[
                        "cruise://C:/Users/async/.cruise/album-arts/1.jpg",
                        "cruise://C:/Users/async/.cruise/album-arts/2.jpg",
                        "cruise://C:/Users/async/.cruise/album-arts/2.jpg",
                        "cruise://C:/Users/async/.cruise/album-arts/1.jpg",
                    ]}
                />
            </Box>
        </Page>
    );
}
