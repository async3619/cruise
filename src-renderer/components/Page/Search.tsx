import React from "react";

import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";

import { useLibrary } from "@components/Library/Provider";

import { SearchInput } from "@components/ui/SearchInput";
import { Autocomplete } from "@components/ui/Autocomplete";

import { Page } from "@components/Page";
import { Root } from "@components/Page/Search.styles";

import { SearchSuggestionType } from "@queries";

export interface SearchPageProps {
    title?: string;
    children?: React.ReactNode;
    onSearch?(query: string): void;
}

const SearchSuggestionIcon: Record<SearchSuggestionType, React.ComponentType> = {
    [SearchSuggestionType.Music]: MusicNoteIcon,
    [SearchSuggestionType.Album]: AlbumRoundedIcon,
    [SearchSuggestionType.Artist]: Person2RoundedIcon,
};

export function SearchPage({ title, children, onSearch }: SearchPageProps) {
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
                <Autocomplete
                    fullWidth
                    items={fetchSuggestions}
                    getOptionLabel={item => item.name}
                    getOptionIcon={item => SearchSuggestionIcon[item.type]}
                    renderInput={props => <SearchInput placeholder="검색..." {...props} />}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </Root>
        );
    };

    return (
        <Page title={title} renderHeader={renderHeader}>
            {children}
        </Page>
    );
}
