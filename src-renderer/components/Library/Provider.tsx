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
import { ToastInstance } from "@components/Toast/types";

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
    const dialog = useDialog();
    const { i18n, t } = useTranslation();
    const toast = useToast();
    const library = React.useRef(new Library(client, dialog, i18n, toast));
    const isScanning = library.current.useScanningState();
    const previousScanningState = React.useRef(isScanning);
    const [scanningToastInstance, setScanningToastInstance] = React.useState<ToastInstance | null>(null);

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

    React.useEffect(() => {
        (async () => {
            const needScan = await library.current.needScan();
            if (!needScan) {
                return;
            }

            await library.current.scan();
        })();
    }, []);

    React.useEffect(() => {
        if (isScanning === previousScanningState.current) {
            return;
        }

        if (isScanning && !previousScanningState.current) {
            const instance = toast.enqueueToast({
                message: t("toast.scanning.pending"),
                loading: true,
            });

            setScanningToastInstance(instance);
        }

        if (!isScanning && previousScanningState.current) {
            if (scanningToastInstance) {
                scanningToastInstance.update({
                    message: t("toast.scanning.success"),
                    severity: "success",
                    loading: false,
                });
            } else {
                toast.enqueueToast({
                    message: t("toast.scanning.success"),
                    severity: "success",
                });
            }
        }

        previousScanningState.current = isScanning;
    }, [isScanning, scanningToastInstance, t, toast]);

    if (!playlists) {
        return null;
    }

    return (
        <LibraryContext.Provider value={{ library: library.current, playlists }}>
            {props.children}
        </LibraryContext.Provider>
    );
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
