import React from "react";
import { useTranslation } from "react-i18next";

import { Page } from "@components/Page";
import { MusicList } from "@components/MusicList";
import { useLibrary } from "@components/Library/Provider";

export interface MusicsProps {}

export function Musics({}: MusicsProps) {
    const { t } = useTranslation();
    const { library } = useLibrary();
    const { musics, loading } = library.useMusics();

    if (loading || !musics) {
        return <Page loading title={t("pageTitle.musics")} />;
    }

    return (
        <Page title={t("pageTitle.musics")}>
            <MusicList items={musics} />
        </Page>
    );
}
