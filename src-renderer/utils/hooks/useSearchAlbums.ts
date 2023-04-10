import _ from "lodash";
import React from "react";
import { haunted } from "@utils/haunted";

export function useSearchAlbums(locales: string[] | null, query: string) {
    const searchAlbums = haunted.searchAlbums.useQuery(
        {
            query,
            limit: 1,
        },
        {
            enabled: !!locales,
        },
    );

    const searchLocalAlbums = haunted.searchAlbums.useQuery(
        {
            query,
            limit: 1,
            locale: locales?.[0],
        },
        {
            enabled: !!locales,
        },
    );

    const isLoading = searchAlbums.isLoading || searchLocalAlbums.isLoading;
    const isError = searchAlbums.isError || searchLocalAlbums.isError;
    const error = searchAlbums.error ?? searchLocalAlbums.error ?? null;

    const result = React.useMemo(() => {
        const data = [
            ...(searchLocalAlbums.data?.map(album => ({ locale: locales?.[0], album })) || []),
            ...(searchAlbums.data?.map(album => ({ locale: null, album })) || []),
        ];

        if (data.length <= 1) {
            return data;
        }

        // get unique items by deep equality
        return _.uniqWith(data, (a, b) => _.isEqual(a.album, b.album));
    }, [searchLocalAlbums.data, searchAlbums.data, locales]);

    return {
        isLoading,
        isError,
        data: result,
        error,
    };
}

export type SearchedAlbum = ReturnType<typeof useSearchAlbums>["data"][0];
