import _ from "lodash";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { AlbumArtType, useAlbumsRemovedSubscription } from "@queries";

import { usePlayer } from "@/components/Player/Provider";
import { useMusicSelection } from "@components/MediaSelection/Provider";
import { useLibrary, usePlaylists } from "@components/Library/Provider";
import { ShrinkHeaderPage } from "@components/Page/ShrinkHeader";
import { SelectionToolbar } from "@components/Layout/SelectionToolbar";
import { MusicList } from "@components/MusicList";
import { Checkbox } from "@components/ui/Checkbox";

import { formatSeconds } from "@utils/formatTime";
import { generateAddToPlaylistMenuItems } from "@constants/menu";

export interface AlbumProps {}

export function Album({}: AlbumProps) {
    const library = useLibrary();
    const { id: idParam } = useParams<{ id: string }>();
    const player = usePlayer();
    const playlists = usePlaylists();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { selectAll } = useMusicSelection();
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
    const tokens = _.compact([
        album.year,
        t("common.trackCount", { count: album.musicCount }),
        formatSeconds(totalDuration),
    ]);

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
                    label: t("common.playAll"),
                    variant: "contained",
                    color: "primary",
                    startIcon: <PlayArrowRoundedIcon />,
                    onClick: () => playAlbum(),
                },
                {
                    label: t("common.shuffleAll"),
                    variant: "contained",
                    color: "inherit",
                    startIcon: <ShuffleRoundedIcon />,
                    onClick: () => playAlbum(true),
                },
                {
                    label: t("common.add"),
                    variant: "contained",
                    color: "inherit",
                    startIcon: <AddRoundedIcon />,
                    menuItems: generateAddToPlaylistMenuItems({
                        t,
                        playlists,
                        onNowPlayingClick: () => {
                            player.addMusicsToPlaylist(album.musics);
                        },
                        onNewPlaylistClick: () => {
                            library.createPlaylistWithMusics(album.musics);
                        },
                        onPlaylistClick: playlist => {
                            library.addMusicsToPlaylist(playlist.id, album.musics);
                        },
                    }),
                },
            ]}
        >
            <SelectionToolbar type="music" innerPadding gutterBottom>
                <Checkbox checked={false} size="small" label={t("common.selectAll")} onChange={handleSelectAll} />
            </SelectionToolbar>
            <MusicList selectable withTrackNumber items={album.musics} />
        </ShrinkHeaderPage>
    );
}
