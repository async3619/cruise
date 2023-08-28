import React from "react";
import { useTranslation } from "react-i18next";

import { useMusicsQuery } from "@graphql/queries";

import { Page } from "@components/Page";
import { MusicList } from "@components/MusicList";

export interface MusicsProps {}

export function Musics({}: MusicsProps) {
    const { t } = useTranslation();
    const { data, loading } = useMusicsQuery();

    if (!data || loading) {
        return <Page header={t("pages.musics")} loading />;
    }

    return (
        <Page header={t("pages.musics")}>
            <MusicList musics={data.musics} />
        </Page>
    );
}
