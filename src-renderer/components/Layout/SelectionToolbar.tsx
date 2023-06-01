import React from "react";
import useMeasure from "react-use-measure";
import { mergeRefs } from "react-merge-refs";

import { Box, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useMediaSelection } from "@components/MediaSelection/Provider";
import { useLibrary, usePlaylists } from "@components/Library/Provider";
import { usePlayer } from "@components/Player/Provider";
import { useShrinkHeader } from "@components/Page/ShrinkHeader";
import { MenuItem } from "@components/Menu";
import { Button } from "@components/ui/Button";
import { Checkbox } from "@components/ui/Checkbox";

import { MinimalAlbumFragment, MinimalMusicFragment } from "@queries";
import { getMusics, isAlbumArray, isMusicArray } from "@utils/media";

import { Children, ChildrenWrapper, Root } from "@components/Layout/SelectionToolbar.styles";

export interface BaseSelectionToolbarProps {
    children?: React.ReactNode;
    gutterBottom?: boolean;
    innerPadding?: boolean;
}

export interface MusicSelectionToolbarProps extends BaseSelectionToolbarProps {
    type: "music";
    onDelete?(indices: ReadonlyArray<number>, musics: ReadonlyArray<MinimalMusicFragment>): void;
}
export interface AlbumSelectionToolbarProps extends BaseSelectionToolbarProps {
    type: "album";
    onDelete?(indices: ReadonlyArray<number>, albums: ReadonlyArray<MinimalAlbumFragment>): void;
}

export type SelectionToolbarProps = MusicSelectionToolbarProps | AlbumSelectionToolbarProps;

export function SelectionToolbar(props: SelectionToolbarProps) {
    const { children, onDelete, gutterBottom, innerPadding, type } = props;
    const mediaSelection = useMediaSelection();
    const { selectedIndices, cancelAll, selectedItem, selectAll, items: musics } = mediaSelection[type];
    const shrinkHeader = useShrinkHeader();
    const playlists = usePlaylists();
    const player = usePlayer();
    const library = useLibrary();
    const [displayCount, setDisplayCount] = React.useState(0);
    const rootDomRef = React.useRef<HTMLDivElement>(null);
    const [ref, { height: toolbarHeight }] = useMeasure();
    const rootRef = mergeRefs([ref, rootDomRef]);

    const handleHeightChange = React.useCallback((height: number) => {
        if (!rootDomRef.current) {
            return;
        }

        rootDomRef.current.style.top = `${height}px`;
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
    const handleDelete = React.useCallback(
        (indices: typeof selectedIndices, items: typeof selectedItem) => {
            if (typeof onDelete !== "function") {
                return;
            }

            if (isAlbumArray(items) && type === "album") {
                onDelete(indices, items);
            }

            if (isMusicArray(items) && type === "music") {
                onDelete(indices, items);
            }
        },
        [onDelete, type],
    );

    React.useEffect(() => {
        if (!shrinkHeader) {
            return;
        }

        shrinkHeader.subscribe(handleHeightChange);

        return () => {
            shrinkHeader.unsubscribe(handleHeightChange);
        };
    }, [handleHeightChange, shrinkHeader]);
    React.useEffect(() => {
        if (!selectedIndices.length) {
            return;
        }

        setDisplayCount(selectedIndices.length);
    }, [selectedIndices.length]);

    const addMenuItems = React.useMemo<MenuItem[]>(() => {
        const addToPlaylist = (playlistId?: number) => {
            if (!selectedItem.length) {
                return;
            }

            if (isAlbumArray(selectedItem)) {
                const musics = getMusics(selectedItem);
                if (typeof playlistId === "number") {
                    library.addMusicsToPlaylist(playlistId, musics);
                } else {
                    player.addMusicsToPlaylist(musics);
                }
            }

            if (isMusicArray(selectedItem)) {
                if (typeof playlistId === "number") {
                    library.addMusicsToPlaylist(playlistId, selectedItem);
                } else {
                    player.addMusicsToPlaylist(selectedItem);
                }
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
                    if (!selectedItem.length) {
                        return;
                    }

                    if (isAlbumArray(selectedItem)) {
                        const musics = getMusics(selectedItem);
                        library.createPlaylistWithMusics(musics);
                    }

                    if (isMusicArray(selectedItem)) {
                        library.createPlaylistWithMusics(selectedItem);
                    }

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
    }, [selectedItem, library, player, playlists, cancelAll]);

    const styles: React.CSSProperties = {};
    const childrenStyles: React.CSSProperties = {};

    if (selectedIndices.length) {
        styles.zIndex = 100;
        styles.opacity = 1;
        styles.pointerEvents = "auto";
    }

    if (!gutterBottom) {
        styles.marginBottom = 0;
    }

    if (!innerPadding) {
        childrenStyles.paddingLeft = 0;
        childrenStyles.paddingRight = 0;
        childrenStyles.height = toolbarHeight || "auto";
    }

    const isIndeterminate = selectedIndices.length > 0 && selectedIndices.length < (musics?.length ?? 0);
    const isDisabled = !selectedIndices.length || !musics?.length;
    const isAllChecked = selectedIndices.length === (musics?.length ?? 0);

    return (
        <>
            <ChildrenWrapper>
                <Children style={childrenStyles}>{children}</Children>
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
                            onClick={() => handleDelete(selectedIndices, selectedItem)}
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
