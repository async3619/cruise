import React from "react";
import { useTranslation } from "react-i18next";

import { Box, CircularProgress, Fade, Stack, Typography } from "@mui/material";

import { SearchPage } from "@components/Page/Search";
import { MusicList } from "@components/MusicList";
import { SearchSection } from "@components/SearchSection";
import { CardList } from "@components/CardList";
import { usePlayer } from "@components/Player/Provider";

import { MinimalAlbumFragment, MinimalArtistFragment, MinimalMusicFragment, useSearchQuery } from "@queries";
import { isAlbum } from "@utils/media";

export interface SearchProps {}

export function Search({}: SearchProps) {
    const { t } = useTranslation();
    const player = usePlayer();
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const { data, loading } = useSearchQuery({
        variables: {
            query: searchQuery,
        },
        skip: !searchQuery,
        fetchPolicy: "no-cache",
    });

    const handleSearch = React.useCallback((query: string) => {
        setSearchQuery(query);
    }, []);
    const handlePlay = (item: MinimalAlbumFragment | MinimalArtistFragment) => {
        const musics: MinimalMusicFragment[] = [];
        if (isAlbum(item)) {
            musics.push(...item.musics);
        } else {
            for (const album of item.leadAlbums) {
                musics.push(...album.musics);
            }
        }

        player.playPlaylist(musics, 0);
    };

    let children: React.ReactNode;
    if (!data) {
        if (!searchQuery) {
            children = (
                <Box py={4}>
                    <Typography variant="body1" color="text.disabled" textAlign="center">
                        {t("notSearched")}
                    </Typography>
                </Box>
            );
        } else {
            children = (
                <Box p={2} display="flex" justifyContent="center">
                    <CircularProgress size={36} />
                </Box>
            );
        }
    } else {
        const { total, musics, artists, albums } = data.search;
        if (total === 0) {
            children = (
                <Box py={4}>
                    <Typography variant="body1" color="text.disabled" textAlign="center">
                        {t("emptySearch")}
                    </Typography>
                </Box>
            );
        } else {
            children = (
                <Stack spacing={3}>
                    {musics.length > 0 && (
                        <SearchSection hasMore={musics.length > 5} title={`음악 (${musics.length})`}>
                            <MusicList maxItems={5} items={musics} />
                        </SearchSection>
                    )}
                    {albums.length > 0 && (
                        <SearchSection hasMore={albums.length > 10} title={`앨범 (${albums.length})`}>
                            <CardList direction="horizontal" items={albums} onPlay={handlePlay} />
                        </SearchSection>
                    )}
                    {artists.length > 0 && (
                        <SearchSection hasMore={artists.length > 10} title={`아티스트 (${artists.length})`}>
                            <CardList direction="horizontal" items={artists} onPlay={handlePlay} />
                        </SearchSection>
                    )}
                </Stack>
            );
        }
    }

    return (
        <SearchPage title={t("Search")} onSearch={handleSearch}>
            <Fade in={!searchQuery ? true : !loading}>{children}</Fade>
        </SearchPage>
    );
}
