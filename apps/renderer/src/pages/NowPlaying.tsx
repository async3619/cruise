import React from "react";
import { useTranslation } from "react-i18next";

import { usePlayer } from "@components/Player/context";
import { PlaylistPage } from "@components/Page/Playlist";

export interface NowPlayingProps {}

export function NowPlaying({}: NowPlayingProps) {
    const { playlist } = usePlayer();
    const { t } = useTranslation();

    return <PlaylistPage musics={playlist} title={t("common.now-playing")} />;
}
