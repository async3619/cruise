import React from "react";
import { useTranslation } from "react-i18next";

import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

import { SearchPage } from "@components/Page/Search";
import { Library } from "@components/Library";
import { useLibrary } from "@components/Library/Provider";

import { ArtistSearch } from "@pages/Search/Artist";
import { MusicSearch } from "@pages/Search/Music";
import { AllSearch } from "@pages/Search/All";
import { AlbumSearch } from "@pages/Search/Album";

import { MinimalAlbumFragment, MinimalArtistFragment, MinimalMusicFragment, SearchMode } from "@queries";
import { isAlbum } from "@utils/media";
import { usePlayer } from "@components/Player/Provider";

export interface SearchProps {
    search: Exclude<ReturnType<Library["useSearch"]>["data"], null | undefined>["search"];
    onSearchModeChange(mode: SearchMode): void;
    onPlay(album: MinimalAlbumFragment | MinimalArtistFragment): void;
}

const SearchComponentMap: Record<SearchMode, React.ComponentType<SearchProps>> = {
    [SearchMode.Music]: MusicSearch,
    [SearchMode.Album]: AlbumSearch,
    [SearchMode.Artist]: ArtistSearch,
    [SearchMode.All]: AllSearch,
};

export function Search() {
    const { t } = useTranslation();
    const library = useLibrary();
    const player = usePlayer();
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [searchMode, setSearchMode] = React.useState<SearchMode>(SearchMode.All);
    const [contentDOM, setContentDOM] = React.useState<HTMLDivElement | null>(null);
    const SearchComponent = SearchComponentMap[searchMode];
    const { data, loading } = library.useSearch(searchQuery, searchMode, !!searchQuery);

    const handlePlay = (item: MinimalAlbumFragment | MinimalArtistFragment) => {
        const musics: MinimalMusicFragment[] = [];
        if (isAlbum(item)) {
            musics.push(...item.musics);
        } else {
            musics.push(...item.leadAlbums.flatMap(album => album.musics));
        }

        player.playPlaylist(musics, 0);
    };

    const lastData = React.useRef<typeof data | null>(null);
    React.useEffect(() => {
        if (loading || !contentDOM) {
            return;
        }

        if (!data || data === lastData.current) {
            return;
        }

        contentDOM.animate(
            [
                { opacity: 0, transform: "translateY(16px)" },
                { opacity: 1, transform: "translateY(0)" },
            ],
            {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeInOut,
            },
        );
        lastData.current = data;
    }, [contentDOM, data, loading, theme]);

    return (
        <SearchPage
            title={t("pageTitle.search")}
            onSearch={setSearchQuery}
            searchMode={searchMode}
            onSearchModeChange={setSearchMode}
        >
            {!searchQuery && (
                <Box py={9} display="flex" justifyContent="center">
                    <Typography variant="body1" align="center" color="text.disabled">
                        {t("search.notSearched")}
                    </Typography>
                </Box>
            )}
            {!!searchQuery && (
                <>
                    {loading && (
                        <Box py={9} display="flex" justifyContent="center">
                            <CircularProgress size={36} />
                        </Box>
                    )}
                    <Box ref={setContentDOM} pt={1}>
                        {!data?.search.total && !loading && (
                            <Box py={8} display="flex" justifyContent="center">
                                <Typography variant="body1" align="center" color="text.disabled">
                                    {t("search.empty")}
                                </Typography>
                            </Box>
                        )}
                        {data && data.search.total > 0 && (
                            <SearchComponent
                                search={data.search}
                                onSearchModeChange={setSearchMode}
                                onPlay={handlePlay}
                            />
                        )}
                    </Box>
                </>
            )}
        </SearchPage>
    );
}
