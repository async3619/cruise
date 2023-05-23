import _ from "lodash";
import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { AlbumArtType } from "@queries";

import { usePlayer } from "@/components/Player/Provider";
import { useLibrary } from "@components/Library/Provider";
import { ShrinkHeaderPage } from "@components/Page/ShrinkHeaderPage";
import { MusicList } from "@components/MusicList";

import { formatSeconds } from "@utils/formatTime";

export interface AlbumProps {}

export function Album({}: AlbumProps) {
    const library = useLibrary();
    const { id: idParam } = useParams<{ id: string }>();
    const player = usePlayer();
    const { t } = useTranslation();
    if (!idParam) {
        throw new Error("id is required");
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        throw new Error("id must be a number");
    }

    const { album, loading } = library.useAlbum(id);

    if (loading || !album) {
        return (
            <ShrinkHeaderPage title="test">
                <span>loading</span>
            </ShrinkHeaderPage>
        );
    }

    const subtitle = album.leadArtists.map(artist => artist.name).join(", ");
    const albumArt = album.albumArts.find(albumArt => albumArt.type === AlbumArtType.CoverFront) || album.albumArts[0];
    const totalDuration = album.musics.reduce((acc, music) => acc + music.duration, 0);
    const tokens = _.compact([album.year, t("trackCount", { count: album.musicCount }), formatSeconds(totalDuration)]);

    const playAlbum = (shuffled?: boolean) => {
        player.playPlaylist(album.musics, 0, shuffled);
    };

    return (
        <ShrinkHeaderPage
            title={album.title}
            subtitle={subtitle}
            imageSrc={albumArt?.url}
            tokens={tokens}
            buttons={[
                {
                    label: t("playAll"),
                    variant: "contained",
                    color: "primary",
                    startIcon: <PlayArrowRoundedIcon />,
                    onClick: () => playAlbum(),
                },
                {
                    label: t("shuffleAll"),
                    variant: "contained",
                    color: "inherit",
                    startIcon: <ShuffleRoundedIcon />,
                    onClick: () => playAlbum(true),
                },
            ]}
        >
            <MusicList items={album.musics} />
        </ShrinkHeaderPage>
    );
}
