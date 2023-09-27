import React from "react";
import { useTranslation } from "react-i18next";

import { Autocomplete } from "ui";

import { Typography } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";

import { Page } from "@components/Page";
import { SearchInput } from "@components/SearchInput";
import { useLibrary } from "@components/Library/context";

import { SearchSuggestionItem } from "@utils/types";
import { SearchSuggestionType } from "@graphql/queries";

export interface SearchProps {}

export function Search({}: SearchProps) {
    const { t } = useTranslation();
    const library = useLibrary();

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

    const header = (
        <>
            <Typography variant="h2" fontSize="1.85rem" sx={{ mb: 1 }}>
                {t("pages.search")}
            </Typography>
            <Autocomplete
                fullWidth
                items={getItems}
                getItemIcon={getItemIcon}
                getItemLabel={item => item.title}
                getItemKey={item => `${item.type}_${item.id}`}
                renderInput={(props, loading) => <SearchInput loading={loading} {...props} />}
            />
        </>
    );

    return <Page header={header}>123</Page>;
}
