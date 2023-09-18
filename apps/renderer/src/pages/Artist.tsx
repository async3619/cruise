import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { isNumericString } from "utils";
import { IconTab } from "ui";

import { Box, CircularProgress } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";

import { useLibrary } from "@components/Library/context";
import { usePlayer } from "@components/Player/context";
import { MusicList } from "@components/MusicList";
import { AlbumArtistList } from "@components/AlbumArtist/List";
import { AlbumSelection, AlbumSelectionToolbar, MusicSelection, MusicSelectionToolbar } from "@components/Selection";
import { ButtonItem, ShrinkHeaderPage } from "@components/Page/ShrinkHeader";

import { MinimalAlbum } from "@utils/types";
import { FadeIn } from "@components/FadeIn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

type ListMode = "musics" | "albums";

export function Artist() {
    const { id } = useParams<{ id: string }>();
    const library = useLibrary();
    const player = usePlayer();
    const { t } = useTranslation();
    const [listMode, setListMode] = React.useState<ListMode>("musics");

    if (!id || !isNumericString(id)) {
        throw new Error("Invalid album id");
    }

    const artist = library.useArtist(parseInt(id, 10));
    const musics = React.useMemo(() => artist?.albums?.flatMap(a => a.musics) ?? [], [artist]);
    const tokens = [
        t("common.albumWithCount", { count: artist?.albums?.length ?? 0 }),
        t("common.musicWithCount", { count: musics.length }),
    ];

    const handlePlayAlbum = React.useCallback(
        (item: MinimalAlbum) => {
            player.playPlaylist(item.musics);
        },
        [player],
    );

    const handlePlayAll = React.useCallback(() => {
        if (musics.length) {
            player.playPlaylist(musics);
        }
    }, [musics, player]);

    const handleShuffleAll = React.useCallback(() => {
        if (musics.length) {
            player.playPlaylist(musics, 0, true);
        }
    }, [musics, player]);

    const handleAddToPlaylist = React.useCallback(
        (playlistId?: number) => {
            if (!musics.length || !artist) {
                return;
            }

            const musicIds = musics.map(music => music.id);
            if (!musicIds.length) {
                return;
            }

            if (!playlistId) {
                return library.createPlaylist(musicIds);
            } else {
                return library.addMusicsToPlaylist(playlistId, musicIds);
            }
        },
        [artist, musics, library],
    );

    const buttons = React.useMemo<ButtonItem[]>(
        () => [
            {
                variant: "contained",
                size: "small",
                color: "primary",
                label: t("common.play-all"),
                startIcon: <PlayArrowRoundedIcon />,
                disabled: !musics.length,
                onClick: handlePlayAll,
            },
            {
                variant: "contained",
                size: "small",
                color: "inherit",
                label: t("common.shuffle-all"),
                startIcon: <ShuffleRoundedIcon />,
                disabled: !musics.length,
                onClick: handleShuffleAll,
            },
            {
                variant: "contained",
                type: "add-button",
                size: "small",
                color: "inherit",
                label: t("common.add"),
                startIcon: <AddRoundedIcon />,
                disabled: !musics.length,
                onPlaylistSelected: handleAddToPlaylist,
                onPlaylistCreate: handleAddToPlaylist,
            },
        ],
        [handlePlayAll, handleShuffleAll, musics, t, handleAddToPlaylist],
    );

    const ToolbarContent = (
        <Box width="100%" display="flex" justifyContent="flex-end">
            <IconTab<ListMode>
                value={listMode}
                onChange={setListMode}
                items={[
                    { id: "musics", icon: <LibraryMusicRoundedIcon />, label: t("common.track-list") },
                    { id: "albums", icon: <AlbumRoundedIcon />, label: t("common.album-list") },
                ]}
            />
        </Box>
    );

    let toolbar: React.ReactNode;
    if (listMode === "musics") {
        toolbar = <MusicSelectionToolbar playable>{ToolbarContent}</MusicSelectionToolbar>;
    } else {
        toolbar = <AlbumSelectionToolbar playable>{ToolbarContent}</AlbumSelectionToolbar>;
    }

    return (
        <AlbumSelection items={artist?.albums ?? []}>
            <MusicSelection items={musics ?? []}>
                <ShrinkHeaderPage
                    isArtist
                    title={artist?.name || ""}
                    subtitle={t("common.artist")}
                    loading={!artist}
                    albumArt={null}
                    tokens={tokens}
                    buttons={buttons}
                    toolbar={toolbar}
                >
                    <FadeIn key={listMode}>
                        {artist && listMode === "musics" && <MusicList withAlbum musics={musics} />}
                        {artist && listMode === "albums" && (
                            <AlbumArtistList type="album" items={artist.albums} onPlayItem={handlePlayAlbum} />
                        )}
                    </FadeIn>
                    {!artist && (
                        <Box py={2} display="flex" justifyContent="center">
                            <CircularProgress size={36} />
                        </Box>
                    )}
                </ShrinkHeaderPage>
            </MusicSelection>
        </AlbumSelection>
    );
}
