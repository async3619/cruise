import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Box, Stack, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { ButtonItem, ShrinkHeaderPage } from "@components/Page/ShrinkHeader";
import { useLibrary } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";

import { formatSeconds } from "@utils/formatTime";
import { MusicList } from "@components/MusicList";
import { Card } from "@components/Card";
import { MinimalAlbumFragment } from "@queries";

export interface ArtistProps {}

export function Artist({}: ArtistProps) {
    const library = useLibrary();
    const player = usePlayer();
    const { t } = useTranslation();
    const { id: idParam } = useParams<{ id: string }>();
    if (!idParam) {
        throw new Error("id is required");
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        throw new Error("id must be a number");
    }

    const { artist, loading } = library.useArtist(id);
    const allMusics = React.useMemo(() => {
        if (!artist) {
            return [];
        }

        return artist.leadAlbums.flatMap(album => album.musics);
    }, [artist]);

    const totalDuration = React.useMemo(() => {
        return allMusics.reduce((acc, music) => acc + music.duration, 0);
    }, [allMusics]);

    const playAll = () => {
        player.playPlaylist(allMusics, 0);
    };

    const playShuffled = (shuffled?: boolean) => {
        player.playPlaylist(allMusics, 0, shuffled);
    };

    const playAlbum = (album: MinimalAlbumFragment) => {
        player.playPlaylist(album.musics, 0);
    };

    if (loading || !artist) {
        return (
            <ShrinkHeaderPage title="test">
                <span>loading</span>
            </ShrinkHeaderPage>
        );
    }

    const tokens = [
        t("albumCount", { count: artist.leadAlbums.length }),
        t("trackCount", { count: artist.leadAlbums.reduce((acc, album) => acc + album.musics.length, 0) }),
        formatSeconds(totalDuration),
    ];

    const actions: ButtonItem[] = [
        {
            label: t("playAll"),
            variant: "contained",
            color: "primary",
            startIcon: <PlayArrowRoundedIcon />,
            onClick: () => playAll(),
        },
        {
            label: t("shuffleAll"),
            variant: "contained",
            color: "inherit",
            startIcon: <ShuffleRoundedIcon />,
            onClick: () => playShuffled(true),
        },
    ];

    return (
        <ShrinkHeaderPage
            imageType="circle"
            title={artist.name}
            subtitle={t("pageTitle.artists")}
            tokens={tokens}
            buttons={actions}
            imageSrc={artist.portrait?.url}
        >
            <Stack spacing={3}>
                <Stack spacing={1}>
                    <Typography variant="h6">{t("pageTitle.musics")}</Typography>
                    <MusicList items={allMusics.slice(0, 5)} />
                </Stack>
                <Stack spacing={1}>
                    <Typography variant="h6">{t("pageTitle.albums")}</Typography>
                    <Box display="flex" flexWrap="wrap">
                        {artist.leadAlbums.map(item => (
                            <Card key={item.id} item={item} onPlay={playAlbum} />
                        ))}
                    </Box>
                </Stack>
            </Stack>
        </ShrinkHeaderPage>
    );
}
