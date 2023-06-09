import React from "react";
import { useTranslation } from "react-i18next";

import { Stack } from "@mui/material";

import { ContentSection } from "@components/ContentSection";
import { MusicList } from "@components/MusicList";
import { CardList } from "@components/CardList";

import { SearchProps } from "@pages/Search";
import { SearchMode } from "@queries";

export function AllSearch({ search, onSearchModeChange, onPlay }: SearchProps) {
    const { albums, musics, artists } = search;
    const { t } = useTranslation();

    return (
        <Stack spacing={3}>
            {musics.length > 0 && (
                <ContentSection
                    onMoreClick={() => onSearchModeChange(SearchMode.Music)}
                    title={`${t("common.music")} (${musics.length})`}
                >
                    <MusicList maxItems={5} items={musics} />
                </ContentSection>
            )}
            {albums.length > 0 && (
                <ContentSection
                    onMoreClick={() => onSearchModeChange(SearchMode.Album)}
                    title={`${t("common.album")} (${albums.length})`}
                >
                    <CardList direction="horizontal" items={albums} onPlay={onPlay} />
                </ContentSection>
            )}
            {artists.length > 0 && (
                <ContentSection
                    onMoreClick={() => onSearchModeChange(SearchMode.Artist)}
                    title={`${t("common.artist")} (${artists.length})`}
                >
                    <CardList direction="horizontal" items={artists} onPlay={onPlay} />
                </ContentSection>
            )}
        </Stack>
    );
}
