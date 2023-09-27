import React from "react";
import { useTranslation } from "react-i18next";

import { Autocomplete, AutocompleteController } from "ui";

import { Box, Stack, Typography } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";

import { Page } from "@components/Page";
import { SearchInput } from "@components/SearchInput";
import { useLibrary } from "@components/Library/context";
import { MusicList } from "@components/MusicList";
import { AlbumArtistList } from "@components/AlbumArtist/List";
import { usePlayer } from "@components/Player/context";

import { MinimalAlbum, SearchResult, SearchSuggestionItem } from "@utils/types";
import { FullArtistFragment, SearchSuggestionType } from "@graphql/queries";

export interface SearchProps {}

export function Search({}: SearchProps) {
    const { t } = useTranslation();
    const player = usePlayer();
    const library = useLibrary();
    const lastQuery = React.useRef("");
    const [searchResult, setSearchResult] = React.useState<SearchResult | null>(null);
    const [isSearching, setIsSearching] = React.useState(false);

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
            <Autocomplete
                fullWidth
                items={getItems}
                getItemIcon={getItemIcon}
                getItemLabel={item => item.title}
                getItemKey={item => `${item.type}_${item.id}`}
                renderInput={(props, loading) => <SearchInput loading={loading} {...props} />}
                onKeyDown={handleKeyDown}
            />
        </>
    );

    return (
        <Page header={header} loading={isSearching}>
            {searchResult && (
                <Stack spacing={3}>
                    {searchResult.musics.length > 0 && (
                        <Box>
                            <Typography variant="h6">
                                {t("pages.musics")} ({searchResult.musics.length})
                            </Typography>
                            <Box mt={1}>
                                <MusicList musics={searchResult.musics.slice(0, 5)} />
                            </Box>
                        </Box>
                    )}
                    {searchResult.albums.length > 0 && (
                        <Box>
                            <Typography variant="h6">
                                {t("pages.albums")} ({searchResult.albums.length})
                            </Typography>
                            <Box mt={1}>
                                <AlbumArtistList
                                    type="album"
                                    items={searchResult.albums.slice(0, 5)}
                                    onPlayItem={handlePlayAlbum}
                                />
                            </Box>
                        </Box>
                    )}
                    {searchResult.artists.length > 0 && (
                        <Box>
                            <Typography variant="h6">
                                {t("pages.artists")} ({searchResult.artists.length})
                            </Typography>
                            <Box mt={1}>
                                <AlbumArtistList
                                    type="artist"
                                    items={searchResult.artists.slice(0, 5)}
                                    onPlayItem={handlePlayArtist}
                                />
                            </Box>
                        </Box>
                    )}
                </Stack>
            )}
        </Page>
    );
}
