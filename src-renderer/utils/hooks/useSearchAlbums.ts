import _ from "lodash";
import React from "react";
import stringSimilarity from "string-similarity";

import { haunted } from "@utils/haunted";

export function useSearchAlbums(locales: string[] | null, albumName: string, leadArtistName: string) {
    const query = `${albumName} ${leadArtistName}`;
    const searchAlbums = haunted.searchAlbums.useQuery(
        {
            query,
            limit: 5,
        },
        {
            enabled: !!locales,
        },
    );

    const searchLocalAlbums = haunted.searchAlbums.useQuery(
        {
            query,
            limit: 5,
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
        if (isLoading || isError) {
            return null;
        }

        let data = [
            ...(searchLocalAlbums.data?.map(album => ({ locale: locales?.[0], album })) || []),
            ...(searchAlbums.data?.map(album => ({ locale: null, album })) || []),
        ];

        if (data.length <= 1) {
            return data;
        }

        const matchedAlbumIds = new Set<string>();
        for (const item of data) {
            const isMatched = item.album.title.includes(albumName);
            if (isMatched) {
                matchedAlbumIds.add(item.album.id);
            }
        }

        data = data.filter(item => matchedAlbumIds.has(item.album.id));
        data = _.orderBy(data, item => stringSimilarity.compareTwoStrings(item.album.title, albumName), "desc");

        // get unique items by deep equality
        return _.uniqWith(data, (a, b) => _.isEqual(a.album, b.album));
    }, [albumName, searchLocalAlbums.data, searchAlbums.data, locales, isLoading, isError]);

    return {
        isLoading,
        isError,
        data: result,
        error,
    };
}

export type SearchedAlbum = Exclude<ReturnType<typeof useSearchAlbums>["data"], null>[0];
