import _ from "lodash";

import React from "react";
import { useTranslation } from "react-i18next";

import { Box, CircularProgress, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useMusicSelection } from "@components/MediaSelection/Provider";
import { useLibrary } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";
import { ButtonItem, ShrinkHeaderPage } from "@components/Page/ShrinkHeader";
import { MusicList } from "@components/MusicList";
import { SelectionToolbar } from "@components/Layout/SelectionToolbar";
import { Checkbox } from "@components/ui/Checkbox";

import { MinimalMusicFragment, MinimalPlaylistFragment } from "@queries";

import { formatSeconds } from "@utils/formatTime";
import { frequentBy } from "@utils/frequentBy";

export interface PlaylistPageProps {
    title: string;
    musics?: ReadonlyArray<MinimalMusicFragment> | null;
    playlist?: MinimalPlaylistFragment;
    onDelete?(indices: ReadonlyArray<number>): void;
}

export function PlaylistPage({ title, playlist, musics, onDelete }: PlaylistPageProps) {
    const { t } = useTranslation();
    const { selectAll, setItems } = useMusicSelection();
    const player = usePlayer();
    const library = useLibrary();

    let tokens: string[] = [];
    let children: React.ReactNode;
    let playable = false;
    let loaded = false;

    if (!musics) {
        children = (
            <Box py={4}>
                <CircularProgress size={36} />
            </Box>
        );
    } else {
        loaded = true;
        if (musics.length !== 0) {
            children = <MusicList selectable items={musics} />;
        } else {
            playable = true;

            children = (
                <Box py={4}>
                    <Typography variant="body1" color="text.disabled" textAlign="center">
                        {t("playlist.empty")}
                    </Typography>
                </Box>
            );
        }

        const totalDuration = _.sumBy(musics, music => music.duration);
        tokens = [t("common.trackCount", { count: musics.length }), formatSeconds(totalDuration)];
    }

    const buttons: ButtonItem[] = [
        {
            label: t("common.playAll"),
            variant: "contained",
            color: "primary",
            startIcon: <PlayArrowRoundedIcon />,
            disabled: playable || !musics,
            onClick: () => musics && player.playPlaylist(musics, 0),
        },
        {
            label: t("common.shuffleAll"),
            variant: "contained",
            color: "inherit",
            startIcon: <ShuffleRoundedIcon />,
            disabled: playable || !musics,
            onClick: () => musics && player.playPlaylist(musics, 0, true),
        },
    ];

    if (playlist) {
        buttons.push(
            {
                label: t("common.rename"),
                variant: "contained",
                color: "inherit",
                startIcon: <EditRoundedIcon />,
                disabled: !loaded,
                onClick: () => library.renamePlaylist(playlist),
            },
            {
                label: t("common.delete"),
                variant: "contained",
                color: "inherit",
                startIcon: <DeleteRoundedIcon />,
                disabled: !loaded,
                onClick: () => library.deletePlaylist(playlist),
            },
        );
    } else {
        buttons.push({
            label: t("common.clearAll"),
            variant: "contained",
            color: "inherit",
            startIcon: <DeleteRoundedIcon />,
            disabled: !loaded || !musics?.length,
            onClick: () => player.clearPlaylist(),
        });
    }

    const collageSrc = React.useMemo(() => {
        if (!musics) {
            return undefined;
        }

        return frequentBy(
            musics.map(m => m.albumArts[0].url),
            4,
        );
    }, [musics]);

    React.useEffect(() => {
        setItems(musics ?? []);
    }, [musics, setItems]);

    const handleSelectAll = () => {
        selectAll();
    };

    return (
        <ShrinkHeaderPage
            denseHeaderMargin
            title={title}
            subtitle={t("common.playlists")}
            tokens={tokens}
            buttons={buttons}
            imageSrc={collageSrc}
        >
            <SelectionToolbar type="music" innerPadding onDelete={onDelete}>
                <Checkbox
                    disabled={!musics?.length}
                    checked={false}
                    size="small"
                    label={t("common.selectAll")}
                    onChange={handleSelectAll}
                />
            </SelectionToolbar>
            {children}
        </ShrinkHeaderPage>
    );
}
