import React from "react";

import { Box, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

import { useLayoutMusics } from "@components/Layout";
import { useLibrary, usePlaylists } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";
import { useShrinkHeader } from "@components/Page/ShrinkHeader";
import { MenuItem } from "@components/Menu";
import { Button } from "@components/ui/Button";

import { Root } from "@components/Layout/MusicToolbar.styles";

export interface MusicToolbarProps {}

export function MusicToolbar({}: MusicToolbarProps) {
    const { selectedIndices, cancelAll, selectedMusics } = useLayoutMusics();
    const { subscribe, unsubscribe } = useShrinkHeader();
    const playlists = usePlaylists();
    const player = usePlayer();
    const library = useLibrary();
    const [displayCount, setDisplayCount] = React.useState(0);
    const rootRef = React.useRef<HTMLDivElement>(null);

    const handleHeightChange = React.useCallback((height: number) => {
        if (!rootRef.current) {
            return;
        }

        rootRef.current.style.top = `${height}px`;
    }, []);

    const addMenuItems = React.useMemo<MenuItem[]>(() => {
        const addToPlaylist = (playlistId?: number) => {
            if (!selectedMusics.length) {
                return;
            }

            if (typeof playlistId === "number") {
                library.addMusicsToPlaylist(playlistId, selectedMusics);
            } else {
                player.addMusicsToPlaylist(selectedMusics);
            }

            cancelAll();
        };

        return [
            {
                id: "queue",
                label: "재생 대기열",
                icon: QueueMusicIcon,
                onClick: () => addToPlaylist(),
            },
            "divider",
            {
                id: "create-new",
                label: "새 재생 목록",
                icon: AddRoundedIcon,
                onClick: () => {
                    if (!selectedMusics.length) {
                        return;
                    }

                    library.createPlaylistWithMusics(selectedMusics);
                    cancelAll();
                },
            },
            ...(playlists.map(playlist => ({
                id: `playlist.${playlist.id}`,
                label: playlist.name,
                icon: QueueMusicIcon,
                onClick: () => addToPlaylist(playlist.id),
            })) || []),
        ];
    }, [selectedMusics, library, player, playlists, cancelAll]);

    React.useEffect(() => {
        subscribe(handleHeightChange);

        return () => {
            unsubscribe(handleHeightChange);
        };
    }, [handleHeightChange, subscribe, unsubscribe]);
    React.useEffect(() => {
        if (!selectedIndices.length) {
            return;
        }

        setDisplayCount(selectedIndices.length);
    }, [selectedIndices.length]);

    const styles: React.CSSProperties = {};
    if (selectedIndices.length) {
        styles.zIndex = 100;
        styles.opacity = 1;
    }

    return (
        <Root ref={rootRef} style={styles}>
            <Typography variant="body1" color="text.secondary">
                {displayCount}개 항목 선택됨
            </Typography>
            <Box flex="1 1 auto" />
            <Button
                size="small"
                variant="contained"
                color="inherit"
                startIcon={<AddRoundedIcon />}
                menuItems={addMenuItems}
            >
                추가
            </Button>
        </Root>
    );
}
