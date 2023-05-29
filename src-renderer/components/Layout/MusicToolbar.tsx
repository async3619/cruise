import React from "react";

import { Box, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useLayoutMusics } from "@components/Layout";
import { useLibrary, usePlaylists } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";
import { useShrinkHeader } from "@components/Page/ShrinkHeader";
import { MenuItem } from "@components/Menu";
import { Button } from "@components/ui/Button";
import { Checkbox } from "@components/ui/Checkbox";

import { MinimalMusicFragment } from "@queries";

import { Children, ChildrenWrapper, Root } from "@components/Layout/MusicToolbar.styles";

export interface MusicToolbarProps {
    children?: React.ReactNode;
    onDelete?(indices: ReadonlyArray<number>, musics: ReadonlyArray<MinimalMusicFragment>): void;
}

export function MusicToolbar({ children, onDelete }: MusicToolbarProps) {
    const { selectedIndices, cancelAll, selectedMusics, selectAll, musics } = useLayoutMusics();
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
    const handleCheckAllChange = React.useCallback(
        (_: any, checked: boolean) => {
            if (!checked) {
                cancelAll();
            } else {
                selectAll();
            }
        },
        [cancelAll, selectAll],
    );

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

    const styles: React.CSSProperties = {};
    if (selectedIndices.length) {
        styles.zIndex = 100;
        styles.opacity = 1;
        styles.pointerEvents = "auto";
    }

    const isIndeterminate = selectedIndices.length > 0 && selectedIndices.length < (musics?.length ?? 0);
    const isDisabled = !selectedIndices.length || !musics?.length;
    const isAllChecked = selectedIndices.length === (musics?.length ?? 0);

    return (
        <>
            <ChildrenWrapper>
                <Children>{children}</Children>
            </ChildrenWrapper>
            <Root ref={rootRef} style={styles}>
                <Checkbox
                    size="small"
                    disabled={isDisabled}
                    label="전체 선택"
                    onChange={handleCheckAllChange}
                    checked={isAllChecked}
                    indeterminate={isIndeterminate}
                />
                <Typography variant="body1" color="text.secondary" fontSize="0.9rem">
                    {displayCount}개 항목 선택됨
                </Typography>
                <Box flex="1 1 auto" />
                <Stack direction="row" spacing={1}>
                    <Button
                        disabled={isDisabled}
                        size="small"
                        variant="contained"
                        color="inherit"
                        startIcon={<AddRoundedIcon />}
                        menuItems={addMenuItems}
                    >
                        추가
                    </Button>
                    {onDelete && (
                        <Button
                            disabled={isDisabled}
                            size="small"
                            variant="contained"
                            color="inherit"
                            onClick={() => onDelete(selectedIndices, selectedMusics)}
                            startIcon={<DeleteRoundedIcon />}
                        >
                            목록에서 삭제
                        </Button>
                    )}
                </Stack>
            </Root>
        </>
    );
}
