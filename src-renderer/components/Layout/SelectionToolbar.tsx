import React from "react";

import { Box, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
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
import { useTranslation } from "react-i18next";
import { generateAddToPlaylistMenuItems } from "@constants/menu";

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
    const { t } = useTranslation();
    const { children, onDelete, gutterBottom, innerPadding, type } = props;
    const mediaSelection = useMediaSelection();
    const { selectedIndices, cancelAll, selectedItem, selectAll, items: musics } = mediaSelection[type];
    const shrinkHeader = useShrinkHeader();
    const playlists = usePlaylists();
    const player = usePlayer();
    const library = useLibrary();
    const [displayCount, setDisplayCount] = React.useState(0);
    const rootDomRef = React.useRef<HTMLDivElement>(null);

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
        const targetMusics: MinimalMusicFragment[] = [];
        if (isAlbumArray(selectedItem)) {
            targetMusics.push(...getMusics(selectedItem));
        } else if (isMusicArray(selectedItem)) {
            targetMusics.push(...selectedItem);
        }

        return generateAddToPlaylistMenuItems({
            t,
            playlists,
            onNowPlayingClick: () => {
                player.addMusicsToPlaylist(targetMusics);
                cancelAll();
            },
            onPlaylistClick: playlist => {
                library.addMusicsToPlaylist(playlist.id, targetMusics);
                cancelAll();
            },
            onNewPlaylistClick: async () => {
                await library.createPlaylistWithMusics(targetMusics);
                cancelAll();
            },
        });
    }, [selectedItem, library, player, playlists, cancelAll, t]);

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
    }

    const isIndeterminate = selectedIndices.length > 0 && selectedIndices.length < (musics?.length ?? 0);
    const isDisabled = !selectedIndices.length || !musics?.length;
    const isAllChecked = selectedIndices.length === (musics?.length ?? 0);

    return (
        <>
            <ChildrenWrapper>
                <Children style={childrenStyles}>{children}</Children>
            </ChildrenWrapper>
            <Root ref={rootDomRef} style={styles}>
                <Checkbox
                    size="small"
                    disabled={isDisabled}
                    label={t("common.selectAll")}
                    onChange={handleCheckAllChange}
                    checked={isAllChecked}
                    indeterminate={isIndeterminate}
                />
                <Typography variant="body1" color="text.secondary" fontSize="0.9rem">
                    {t("common.selectedCount", { count: displayCount })}
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
                        {t("common.add")}
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
                            {t("common.removeFromList")}
                        </Button>
                    )}
                </Stack>
            </Root>
        </>
    );
}
