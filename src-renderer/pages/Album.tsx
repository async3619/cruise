import _ from "lodash";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

import { AlbumArtType, useAlbumsRemovedSubscription } from "@queries";

import { usePlayer } from "@/components/Player/Provider";
import { useLibrary, usePlaylists } from "@components/Library/Provider";
import { ShrinkHeaderPage } from "@components/Page/ShrinkHeader";
import { useLayoutMusics } from "@components/Layout";
import { MusicToolbar } from "@components/Layout/MusicToolbar";
import { MusicList } from "@components/MusicList";
import { Checkbox } from "@components/ui/Checkbox";

import { formatSeconds } from "@utils/formatTime";

export interface AlbumProps {}

export function Album({}: AlbumProps) {
    const library = useLibrary();
    const { id: idParam } = useParams<{ id: string }>();
    const player = usePlayer();
    const playlists = usePlaylists();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { selectAll } = useLayoutMusics();
    if (!idParam) {
        throw new Error("id is required");
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        throw new Error("id must be a number");
    }

    const { album, loading } = library.useAlbum(id);
    useAlbumsRemovedSubscription({
        onData: ({ data: { data } }) => {
            if (!data?.albumsRemoved) {
                return;
            }

            console.log(data);
            if (!data.albumsRemoved.includes(id)) {
                return;
            }

            navigate("/albums");
        },
    });

    if (loading || !album) {
        return (
            <ShrinkHeaderPage denseHeaderMargin title="test">
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

    const handleSelectAll = () => {
        selectAll();
    };

    return (
        <ShrinkHeaderPage
            denseHeaderMargin
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
                {
                    label: t("addToPlaylist"),
                    variant: "contained",
                    color: "inherit",
                    startIcon: <AddRoundedIcon />,
                    menuItems: [
                        {
                            id: "queue",
                            label: "재생 대기열",
                            icon: QueueMusicIcon,
                            onClick: () => player.addMusicsToPlaylist(album.musics),
                        },
                        "divider",
                        {
                            id: "create-new",
                            label: "새 재생 목록",
                            icon: AddRoundedIcon,
                            onClick: () => library.createPlaylistWithMusics(album.musics),
                        },
                        ...(playlists.map(playlist => ({
                            id: `playlist.${playlist.id}`,
                            label: playlist.name,
                            icon: QueueMusicIcon,
                            onClick: () => library.addMusicsToPlaylist(playlist.id, album.musics),
                        })) || []),
                    ],
                },
            ]}
        >
            <MusicToolbar>
                <Checkbox checked={false} size="small" label="전체 선택" onChange={handleSelectAll} />
            </MusicToolbar>
            <MusicList selectable withTrackNumber items={album.musics} />
        </ShrinkHeaderPage>
    );
}
