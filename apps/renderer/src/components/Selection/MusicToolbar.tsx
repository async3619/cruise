import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Checkbox, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { AddButton } from "@components/AddButton";
import { useMusicSelection } from "@components/Selection/Music.context";
import { useLibrary } from "@components/Library/context";

import { CheckboxWrapper, Root, Wrapper } from "@components/Selection/MusicToolbar.styles";

export interface MusicSelectionToolbarProps {
    onDelete?(indices: number[]): Promise<void>;
}

export function MusicSelectionToolbar({ onDelete }: MusicSelectionToolbarProps) {
    const { t } = useTranslation();
    const selection = useMusicSelection();
    const [currentCount, setCurrentCount] = React.useState(selection?.selectedIndices.length || 0);
    const [isLoading, setIsLoading] = React.useState(false);
    const library = useLibrary();

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

        const targetIds: number[] = [];
        for (const idx of selection.selectedIndices) {
            targetIds.push(selection.allItems[idx].id);
        }

        await library.createPlaylist(targetIds);
    }, [library, selection]);

    const handlePlaylistSelected = React.useCallback(
        async (playlistId: number) => {
            if (!selection) {
                return;
            }

            const targetIds: number[] = [];
            for (const idx of selection.selectedIndices) {
                targetIds.push(selection.allItems[idx].id);
            }

            await library.addMusicsToPlaylist(playlistId, targetIds);
        },
        [library, selection],
    );

    if (!selection) {
        return null;
    }

    const { selectedIndices, allItems } = selection;

    const indeterminate = selectedIndices.length > 0 && selectedIndices.length < allItems.length;
    const checked = selectedIndices.length === allItems.length;

    return (
        <Wrapper>
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
                </Stack>
            </Root>
        </Wrapper>
    );
}
