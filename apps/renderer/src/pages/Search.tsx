import React from "react";
import { useTranslation } from "react-i18next";

import { Autocomplete, AutocompleteController, ChipRadio, ChipRadioItem } from "ui";

import { Box, Stack, Typography } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";

import { Page } from "@components/Page";
import { SearchInput } from "@components/SearchInput";
import { useLibrary } from "@components/Library/context";
import { usePlayer } from "@components/Player/context";
import { SearchSection } from "@components/SearchSection";

import { MinimalAlbum, SearchResult, SearchSuggestionItem } from "@utils/types";
import { FullArtistFragment, SearchSuggestionType } from "@graphql/queries";

export interface SearchProps {}

export enum SearchType {
    All = "all",
    Musics = "musics",
    Artists = "artists",
    Albums = "albums",
}

export function Search({}: SearchProps) {
    const { t } = useTranslation();
    const player = usePlayer();
    const library = useLibrary();
    const lastQuery = React.useRef("");
    const [searchResult, setSearchResult] = React.useState<SearchResult | null>(null);
    const [isSearching, setIsSearching] = React.useState(false);
    const [searchType, setSearchType] = React.useState<SearchType>(SearchType.All);
    const searchTypeItems = React.useMemo<ChipRadioItem<SearchType>[]>(() => {
        return [
            { label: t("common.all"), value: SearchType.All },
            { label: t("pages.musics"), value: SearchType.Musics },
            { label: t("pages.albums"), value: SearchType.Albums },
            { label: t("pages.artists"), value: SearchType.Artists },
        ];
    }, [t]);

    const getItems = React.useCallback(async () => {
        return library.getSearchSuggestions();
    }, [library]);

    const getItemIcon = React.useCallback((item: SearchSuggestionItem) => {
        switch (item.type) {
            case SearchSuggestionType.Artist:
                return <PeopleAltRoundedIcon />;

            case SearchSuggestionType.Album:
                return <AlbumRoundedIcon />;

            case SearchSuggestionType.Music:
                return <MusicNoteRoundedIcon />;
        }
    }, []);

    const handleKeyDown = React.useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement>, controller: AutocompleteController) => {
            if (event.key !== "Enter") {
                return;
            }

            controller.clearInput();

            const query = event.currentTarget.value;
            if (!query || query === lastQuery.current) {
                return;
            }

            lastQuery.current = query;

            setIsSearching(true);
            setSearchResult(null);

            const data = await library.search(query);

            setIsSearching(false);
            setSearchResult(data);
        },
        [library],
    );

    const handlePlayAlbum = React.useCallback(
        (item: MinimalAlbum) => {
            player.playPlaylist(item.musics, 0);
        },
        [player],
    );

    const handlePlayArtist = React.useCallback(
        (item: FullArtistFragment) => {
            player.playPlaylist(item.musics, 0);
        },
        [player],
    );

    const header = (
        <>
            <Typography variant="h2" fontSize="1.85rem" sx={{ mb: 1.5 }}>
                {t("pages.search")}
            </Typography>
            <Box mb={2}>
                <Autocomplete
                    fullWidth
                    items={getItems}
                    getItemIcon={getItemIcon}
                    getItemLabel={item => item.title}
                    getItemKey={item => `${item.type}_${item.id}`}
                    renderInput={(props, loading) => <SearchInput loading={loading} {...props} />}
                    onKeyDown={handleKeyDown}
                />
            </Box>
            <ChipRadio items={searchTypeItems} value={searchType} onChange={setSearchType} />
        </>
    );

    let totalCounts = 0;
    if (searchResult) {
        if (searchType === SearchType.Musics || searchType === SearchType.All) {
            totalCounts += searchResult.musics.length;
        }

        if (searchType === SearchType.Albums || searchType === SearchType.All) {
            totalCounts += searchResult.albums.length;
        }

        if (searchType === SearchType.Artists || searchType === SearchType.All) {
            totalCounts += searchResult.artists.length;
        }
    }

    return (
        <Page header={header} loading={isSearching} contentKey={searchType}>
            {searchResult && totalCounts > 0 && (
                <Stack spacing={3}>
                    {searchResult.musics.length > 0 &&
                        (searchType === SearchType.Musics || searchType === SearchType.All) && (
                            <SearchSection
                                type="music"
                                title={t("pages.musics")}
                                count={searchResult.musics.length}
                                items={searchResult.musics}
                                maxCount={searchType === SearchType.Musics ? undefined : 5}
                                onShowMore={() => setSearchType(SearchType.Musics)}
                            />
                        )}
                    {searchResult.albums.length > 0 &&
                        (searchType === SearchType.Albums || searchType === SearchType.All) && (
                            <SearchSection
                                type="album"
                                title={t("pages.albums")}
                                count={searchResult.albums.length}
                                items={searchResult.albums}
                                onPlayItem={handlePlayAlbum}
                                maxCount={searchType === SearchType.Albums ? undefined : 5}
                                onShowMore={() => setSearchType(SearchType.Albums)}
                            />
                        )}
                    {searchResult.artists.length > 0 &&
                        (searchType === SearchType.Artists || searchType === SearchType.All) && (
                            <SearchSection
                                type="artist"
                                title={t("pages.artists")}
                                count={searchResult.artists.length}
                                items={searchResult.artists}
                                onPlayItem={handlePlayArtist}
                                maxCount={searchType === SearchType.Artists ? undefined : 5}
                                onShowMore={() => setSearchType(SearchType.Artists)}
                            />
                        )}
                </Stack>
            )}
            {searchResult && totalCounts === 0 && (
                <Box py={4}>
                    <Typography variant="body1" textAlign="center" color="text.disabled">
                        {t("search.messages.no-result", { query: lastQuery.current })}
                    </Typography>
                </Box>
            )}
            {!searchResult && (
                <Box py={4}>
                    <Typography variant="body1" textAlign="center" color="text.disabled">
                        {t("search.messages.not-searched")}
                    </Typography>
                </Box>
            )}
        </Page>
    );
}
