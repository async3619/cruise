import React from "react";
import { useTranslation } from "react-i18next";

import { usePlayer } from "@components/Player/Provider";
import { PlaylistPage } from "@components/Page/Playlist";

export interface NowPlayingProps {}

export function NowPlaying({}: NowPlayingProps) {
    const player = usePlayer();
    const { t } = useTranslation();

    return <PlaylistPage title={t("pageTitle.nowPlaying")} musics={player.playlist ?? []} />;
}
