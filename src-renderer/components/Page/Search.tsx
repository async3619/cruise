import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Stack } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";

import { useLibrary } from "@components/Library/Provider";

import { SearchInput } from "@components/ui/SearchInput";
import { Autocomplete } from "@components/ui/Autocomplete";

import { Page } from "@components/Page";
import { Root } from "@components/Page/Search.styles";

import { SearchMode, SearchSuggestionType } from "@queries";
import { ChipList } from "@components/ChipList";

export interface SearchPageProps {
    title?: string;
    children?: React.ReactNode;
    onSearch?(query: string): void;
    searchMode: SearchMode;
    onSearchModeChange(mode: SearchMode): void;
}

const SearchSuggestionIcon: Record<SearchSuggestionType, React.ComponentType> = {
    [SearchSuggestionType.Music]: MusicNoteIcon,
    [SearchSuggestionType.Album]: AlbumRoundedIcon,
    [SearchSuggestionType.Artist]: Person2RoundedIcon,
};

export function SearchPage({ title, children, onSearch, onSearchModeChange, searchMode }: SearchPageProps) {
    const { t } = useTranslation();
    const library = useLibrary();
    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                const query = event.currentTarget.value;
                if (query) {
                    onSearch?.(query);
                }
            }
        },
        [onSearch],
    );

    const handleChange = React.useCallback(
        (text: string) => {
            if (!text) {
                return;
            }

            onSearch?.(text);
        },
        [onSearch],
    );
    const fetchSuggestions = React.useCallback(
        (query: string) => {
            return library.getSearchSuggestions(query, 5);
        },
        [library],
    );

    const renderHeader = () => {
        return (
            <Root>
                <Box mb={1} width="100%">
                    <Autocomplete
                        fullWidth
                        items={fetchSuggestions}
                        getOptionLabel={item => item.name}
                        getOptionIcon={item => SearchSuggestionIcon[item.type]}
                        renderInput={props => <SearchInput placeholder={`${t("common.search")}...`} {...props} />}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </Box>
                <Stack spacing={1} direction="row">
                    <ChipList
                        items={[
                            {
                                label: t("common.all"),
                                value: SearchMode.All,
                            },
                            {
                                label: t("common.music"),
                                value: SearchMode.Music,
                            },
                            {
                                label: t("common.album"),
                                value: SearchMode.Album,
                            },
                            {
                                label: t("common.artist"),
                                value: SearchMode.Artist,
                            },
                        ]}
                        onChange={onSearchModeChange}
                        value={searchMode}
                    />
                </Stack>
            </Root>
        );
    };

    return (
        <Page title={title} renderHeader={renderHeader} denseHeaderMargin>
            {children}
        </Page>
    );
}
