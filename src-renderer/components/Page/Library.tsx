import React from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { Page } from "@components/Page";
import { Root } from "@components/Page/Library.styles";

import { Button } from "@components/ui/Button";
import { MusicToolbar } from "@components/Layout/MusicToolbar";

export interface LibraryPageProps {
    children?: React.ReactNode;
    title?: string;
    loading?: boolean;
    onShuffleAll?(): void;
}

export function LibraryPage({ children, title, loading, onShuffleAll }: LibraryPageProps) {
    const { t } = useTranslation();

    const renderHeader = React.useCallback(
        (title?: string) => {
            return (
                <Root>
                    <Typography variant="h2" fontSize="2rem" lineHeight={1} sx={{ mb: 2 }}>
                        <span>{title}</span>
                    </Typography>
                    <MusicToolbar>
                        <Button
                            startIcon={<ShuffleRoundedIcon fontSize="small" />}
                            variant="contained"
                            size="small"
                            disabled={loading}
                            onClick={onShuffleAll}
                        >
                            <span>{t("shuffle_all")}</span>
                        </Button>
                    </MusicToolbar>
                </Root>
            );
        },
        [onShuffleAll, t, loading],
    );

    return (
        <Page denseHeaderMargin loading={loading} title={title} renderHeader={renderHeader}>
            {children}
        </Page>
    );
}
