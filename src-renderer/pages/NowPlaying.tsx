import _ from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import { usePlayer } from "@components/Player/Provider";
import { ShrinkHeaderPage } from "@components/Page/ShrinkHeaderPage";
import { MusicList } from "@components/MusicList";

import { formatSeconds } from "@utils/formatTime";

export interface NowPlayingProps {}

export function NowPlaying({}: NowPlayingProps) {
    const player = usePlayer();
    const { t } = useTranslation();

    const musics = [...(player.playlist ?? [])];
    const duration = _.sumBy(musics, music => music.duration);

    return (
        <ShrinkHeaderPage
            title={t("pageTitle.nowPlaying")}
            subtitle={t("Playlists")}
            tokens={[t("trackCount", { count: musics.length }), formatSeconds(duration)]}
            buttons={[
                {
                    label: t("clear_all"),
                    variant: "contained",
                    color: "inherit",
                    startIcon: <ClearRoundedIcon />,
                    onClick: () => player.clearPlaylist(),
                },
            ]}
        >
            {musics.length > 0 && <MusicList items={musics} />}
            {musics.length === 0 && (
                <Typography variant="body1" color="text.disabled" textAlign="center" sx={{ py: 6 }}>
                    재생 목록이 비어있습니다.
                </Typography>
            )}
        </ShrinkHeaderPage>
    );
}
