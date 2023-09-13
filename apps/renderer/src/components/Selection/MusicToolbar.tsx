import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Checkbox, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { CheckboxWrapper, Root, Wrapper } from "@components/Selection/MusicToolbar.styles";
import { useMusicSelection } from "@components/Selection/Music.context";

export interface MusicSelectionToolbarProps {
    onDelete?(indices: number[]): Promise<void>;
}

export function MusicSelectionToolbar({ onDelete }: MusicSelectionToolbarProps) {
    const { t } = useTranslation();
    const selection = useMusicSelection();
    const [currentCount, setCurrentCount] = React.useState(selection?.selectedIndices.length || 0);
    const [isLoading, setIsLoading] = React.useState(false);

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
            </Root>
        </Wrapper>
    );
}
