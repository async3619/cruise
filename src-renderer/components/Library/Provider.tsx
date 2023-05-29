import React from "react";
import { useTranslation } from "react-i18next";

import { useApolloClient } from "@apollo/client";
import {
    MinimalPlaylistFragment,
    usePlaylistAddedSubscription,
    usePlaylistRemovedSubscription,
    usePlaylistsQuery,
    usePlaylistUpdatedSubscription,
} from "@queries";

import { useDialog } from "@components/Dialog/Provider";
import { Library } from "@components/Library";
import { useToast } from "@components/Toast/Provider";

export interface LibraryProviderProps {
    children: React.ReactNode;
}

export interface LibraryContextValue {
    library: Library;
    playlists: MinimalPlaylistFragment[];
}

export const LibraryContext = React.createContext<LibraryContextValue | null>(null);

export function LibraryProvider(props: LibraryProviderProps) {
    const client = useApolloClient();
    const { i18n } = useTranslation();
    const dialog = useDialog();
    const toast = useToast();
    const [library] = React.useState<Library>(new Library(client, dialog, i18n, toast));

    const [playlists, setPlaylists] = React.useState<MinimalPlaylistFragment[] | null>(null);
    const playlistsQuery = usePlaylistsQuery();

    React.useEffect(() => {
        const { data, loading } = playlistsQuery;
        if (loading || !data) {
            return;
        }

        setPlaylists(data.playlists);
    }, [playlistsQuery]);

    usePlaylistAddedSubscription({
        onData: ({ data: { data } }) => {
            setPlaylists(playlists => {
                if (!playlists) {
                    return null;
                }

                return playlists.concat(data?.playlistAdded ?? []);
            });
        },
    });

    usePlaylistRemovedSubscription({
        onData: ({ data: { data } }) => {
            if (!data?.playlistRemoved) {
                return;
            }

            setPlaylists(playlists => {
                if (!playlists) {
                    return null;
                }

                return playlists.filter(playlist => playlist.id !== data.playlistRemoved);
            });
        },
    });

    usePlaylistUpdatedSubscription({
        onData: ({ data: { data } }) => {
            if (!data?.playlistUpdated) {
                return;
            }

            setPlaylists(playlists => {
                if (!playlists) {
                    return null;
                }

                return playlists.map(playlist => {
                    if (playlist.id === data.playlistUpdated?.id) {
                        return data.playlistUpdated;
                    }

                    return playlist;
                });
            });
        },
    });

    if (!playlists) {
        return null;
    }

    return <LibraryContext.Provider value={{ library, playlists }}>{props.children}</LibraryContext.Provider>;
}

export function useLibrary() {
    const context = React.useContext(LibraryContext);
    if (!context) {
        throw new Error("useLibrary must be used within a LibraryProvider");
    }

    return context.library;
}

export function usePlaylists() {
    const context = React.useContext(LibraryContext);
    if (!context) {
        throw new Error("usePlaylists must be used within a LibraryProvider");
    }

    return context.playlists;
}

export function usePlaylist(id: number) {
    const context = React.useContext(LibraryContext);
    if (!context) {
        throw new Error("usePlaylist must be used within a LibraryProvider");
    }

    return context.playlists.find(playlist => playlist.id === id);
}
