import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { isNumericString } from "utils";

import { Box, CircularProgress } from "@mui/material";

import { ShrinkHeaderPage } from "@components/Page/ShrinkHeader";
import { useLibrary } from "@components/Library/context";
import { MusicList } from "@components/MusicList";
import { MusicSelection, MusicSelectionToolbar } from "@components/Selection";

import { useAlbumHeaderButtons } from "@pages/Album.const";

import { formatDuration } from "@utils/duration";
import { MinimalMusic } from "@utils/types";

export interface AlbumProps {}

export function Album({}: AlbumProps) {
    const { id } = useParams<{ id: string }>();
    const library = useLibrary();
    const { t } = useTranslation();

    if (!id || !isNumericString(id)) {
        throw new Error("Invalid album id");
    }

    const albumId = parseInt(id, 10);
    const album = library.useAlbum(albumId);
    const buttons = useAlbumHeaderButtons(album);

    const tokens = React.useMemo(() => {
        if (!album) {
            return [];
        }

        return [
            t("common.musicWithCount", { count: album.musics.length }),
            formatDuration(album.musics.reduce((acc: number, music: MinimalMusic) => acc + music.duration, 0)),
        ];
    }, [album, t]);

    return (
        <MusicSelection items={album?.musics ?? []}>
            <ShrinkHeaderPage
                title={album?.title || ""}
                subtitle={t("common.album")}
                loading={!album}
                albumArt={album?.albumArt}
                tokens={tokens}
                buttons={buttons}
                toolbar={<MusicSelectionToolbar playable />}
            >
                {album && <MusicList musics={album?.musics ?? []} />}
                {!album && (
                    <Box py={2} display="flex" justifyContent="center">
                        <CircularProgress size={36} />
                    </Box>
                )}
            </ShrinkHeaderPage>
        </MusicSelection>
    );
}
