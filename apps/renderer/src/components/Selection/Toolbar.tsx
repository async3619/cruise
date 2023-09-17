import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Checkbox, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { AddButton } from "@components/AddButton";
import { useLibrary } from "@components/Library/context";
import { usePlayer } from "@components/Player/context";
import { SelectionContextValue } from "@components/Selection/context";

import { CheckboxWrapper, ChildrenWrapper, Root, Wrapper } from "@components/Selection/Toolbar.styles";
import { MinimalMusic } from "@utils/types";

export interface SelectionToolbarProps<T> {
    onDelete?(indices: number[]): Promise<void>;
    playable?: boolean;
    children?: React.ReactNode;
    useSelection: () => SelectionContextValue<T> | null;
    getMusics(items: T[], indices: number[]): MinimalMusic[];
}

export function SelectionToolbar<T>({
    onDelete,
    playable = true,
    children,
    useSelection,
    getMusics,
}: SelectionToolbarProps<T>) {
    const { t } = useTranslation();
    const selection = useSelection();
    const [currentCount, setCurrentCount] = React.useState(selection?.selectedIndices.length || 0);
    const [isLoading, setIsLoading] = React.useState(false);
    const library = useLibrary();
    const player = usePlayer();

    React.useEffect(() => {
        if (!selection) {
            return;
        }

        const { selectedIndices } = selection;
        if (selectedIndices.length === currentCount || !selectedIndices.length) {
            return;
        }

        setCurrentCount(selectedIndices.length);
    }, [selection, currentCount]);

    const handleCheckboxChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!selection) {
                return;
            }

            const { allItems } = selection;
            if (event.target.checked) {
                selection.setSelection(allItems.map((_, index) => index));
            } else {
                selection.setSelection([]);
            }
        },
        [selection],
    );

    const handleDelete = React.useCallback(async () => {
        if (!onDelete || !selection) {
            return;
        }

        selection.setSelection([]);

        setIsLoading(true);
        await onDelete(selection.selectedIndices);
        setIsLoading(false);
    }, [onDelete, selection]);

    const handlePlaylistCreate = React.useCallback(async () => {
        if (!selection) {
            return;
        }

        const targetIds = getMusics(selection.allItems, selection.selectedIndices).map(m => m.id);
        await library.createPlaylist(targetIds);
    }, [library, selection, getMusics]);

    const handlePlaylistSelected = React.useCallback(
        async (playlistId: number) => {
            if (!selection) {
                return;
            }

            const targetIds = getMusics(selection.allItems, selection.selectedIndices).map(m => m.id);
            await library.addMusicsToPlaylist(playlistId, targetIds);
        },
        [library, selection, getMusics],
    );

    const handlePlay = React.useCallback(() => {
        if (!selection) {
            return;
        }

        const targetItems = getMusics(selection.allItems, selection.selectedIndices);
        player.playPlaylist(targetItems, 0);
        selection.setSelection([]);
    }, [player, selection, getMusics]);
    const handleShuffle = React.useCallback(() => {
        if (!selection) {
            return;
        }

        const targetMusics = getMusics(selection.allItems, selection.selectedIndices);
        player.playPlaylist(targetMusics, 0, true);
        selection.setSelection([]);
    }, [getMusics, player, selection]);

    if (!selection) {
        return null;
    }

    const { selectedIndices, allItems } = selection;

    const indeterminate = selectedIndices.length > 0 && selectedIndices.length < allItems.length;
    const checked = selectedIndices.length === allItems.length;

    return (
        <Wrapper>
            {children && <ChildrenWrapper>{children}</ChildrenWrapper>}
            <Root isVisible={selectedIndices.length > 0}>
                <CheckboxWrapper>
                    <Checkbox
                        size="small"
                        indeterminate={indeterminate}
                        checked={checked}
                        onChange={handleCheckboxChange}
                        disabled={isLoading}
                    />
                </CheckboxWrapper>
                <Typography variant="body2" color="text.secondary">
                    {t("common.selectedCount", { count: currentCount })}
                </Typography>
                <Box flex="1 1 auto" />
                <Stack direction="row" spacing={1}>
                    {playable && (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<PlayArrowRoundedIcon />}
                                onClick={handlePlay}
                                disabled={isLoading}
                            >
                                {t("common.play-selected")}
                            </Button>
                            <Button
                                variant="contained"
                                color="inherit"
                                size="small"
                                startIcon={<ShuffleRoundedIcon />}
                                onClick={handleShuffle}
                                disabled={isLoading}
                            >
                                {t("common.shuffle-all")}
                            </Button>
                        </>
                    )}
                    <AddButton
                        variant="contained"
                        color="inherit"
                        size="small"
                        startIcon={<AddIcon />}
                        disabled={isLoading}
                        onPlaylistCreate={handlePlaylistCreate}
                        onPlaylistSelected={handlePlaylistSelected}
                    >
                        {t("common.add")}
                    </AddButton>
                    {onDelete && (
                        <Button
                            variant="contained"
                            color="inherit"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {t("common.delete")}
                        </Button>
                    )}
                </Stack>
            </Root>
        </Wrapper>
    );
}
