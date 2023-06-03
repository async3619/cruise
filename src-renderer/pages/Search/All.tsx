import React from "react";

import { Stack } from "@mui/material";

import { SearchSection } from "@components/SearchSection";
import { MusicList } from "@components/MusicList";
import { CardList } from "@components/CardList";

import { SearchProps } from "@pages/Search";
import { SearchMode } from "@queries";

export function AllSearch({ search, onSearchModeChange, onPlay }: SearchProps) {
    const { albums, musics, artists } = search;

    return (
        <Stack spacing={3}>
            {musics.length > 0 && (
                <SearchSection
                    onMoreClick={() => onSearchModeChange(SearchMode.Music)}
                    title={`음악 (${musics.length})`}
                >
                    <MusicList maxItems={5} items={musics} />
                </SearchSection>
            )}
            {albums.length > 0 && (
                <SearchSection
                    onMoreClick={() => onSearchModeChange(SearchMode.Album)}
                    title={`앨범 (${albums.length})`}
                >
                    <CardList direction="horizontal" items={albums} onPlay={onPlay} />
                </SearchSection>
            )}
            {artists.length > 0 && (
                <SearchSection
                    onMoreClick={() => onSearchModeChange(SearchMode.Artist)}
                    title={`아티스트 (${artists.length})`}
                >
                    <CardList direction="horizontal" items={artists} onPlay={onPlay} />
                </SearchSection>
            )}
        </Stack>
    );
}
