import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";

import { useLibrary } from "@components/Library/Provider";
import { ShrinkHeaderPage } from "@components/Page/ShrinkHeaderPage";
import { MusicList } from "@components/MusicList";

export function Playlist() {
    const library = useLibrary();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    if (!id) {
        throw new Error("id is required");
    }

    const idValue = parseInt(id, 10);
    if (isNaN(idValue)) {
        throw new Error("id is not a number");
    }

    const { playlist, loading } = library.usePlaylist(idValue);
    if (loading || !playlist) {
        return <ShrinkHeaderPage title="" />;
    }

    return (
        <ShrinkHeaderPage
            title={playlist.name}
            subtitle={t("Playlists")}
            tokens={[t("trackCount", { count: playlist.musics.length })]}
            buttons={[]}
        >
            {playlist.musics.length > 0 && <MusicList items={playlist.musics} />}
            {playlist.musics.length === 0 && (
                <Typography variant="body1" color="text.disabled" textAlign="center" sx={{ py: 6 }}>
                    재생 목록이 비어있습니다.
                </Typography>
            )}
        </ShrinkHeaderPage>
    );
}
