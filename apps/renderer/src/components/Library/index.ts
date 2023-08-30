/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { ToastAction, useToast } from "ui";

import { ApolloClient } from "@apollo/client";
import {
    executeAddMusicsToPlaylist,
    executeCreatePlaylist,
    executeDeletePlaylist,
    usePlaylistCreatedSubscription,
    usePlaylistDeletedSubscription,
    usePlaylistQuery,
    usePlaylistsQuery,
    usePlaylistUpdatedSubscription,
} from "@graphql/queries";
import { MinimalPlaylist } from "@utils/types";
import { TFunction } from "i18next";
import { AsyncFn, Fn } from "types";

interface ToastMessages {
    success: string;
    error: string;
    pending: string;
}

export class Library {
    private readonly client: ApolloClient<object>;
    private readonly translator: TFunction<"ns1", undefined>;

    public useAddMusicToPlaylist: Fn<[], AsyncFn<[playlistId: number, musicIds: number[]]>>;
    public useCreatePlaylist: Fn<[], AsyncFn<[name: string, musicIds?: number[]], number>>;
    public useDeletePlaylist: Fn<[], AsyncFn<[id: number]>>;

    public constructor(
        client: ApolloClient<object>,
        translator: TFunction<"ns1", undefined>,
        navigate: Fn<[path: string]>,
    ) {
        this.client = client;
        this.translator = translator;

        this.useAddMusicToPlaylist = this.generateHook(this.addMusicToPlaylist.bind(this), {
            pending: this.translator("playlist.add-musics.pending"),
            success: this.translator("playlist.add-musics.success"),
            error: this.translator("playlist.add-musics.error"),
        });
        this.useCreatePlaylist = this.generateHook(
            this.createPlaylist.bind(this),
            {
                pending: this.translator("playlist.create.pending"),
                success: this.translator("playlist.create.success"),
                error: this.translator("playlist.create.error"),
            },
            id => ({
                label: this.translator("common.open"),
                onClick: () => navigate(`/playlists/${id}`),
            }),
        );
        this.useDeletePlaylist = this.generateHook(this.deletePlaylist.bind(this), {
            pending: this.translator("playlist.delete.pending"),
            success: this.translator("playlist.delete.success"),
            error: this.translator("playlist.delete.error"),
        });
    }

    public usePlaylist(id: number) {
        const { data, error, refetch } = usePlaylistQuery({ variables: { id } });

        usePlaylistUpdatedSubscription({
            onData: ({ data: { data } }) => {
                if (!data) {
                    return;
                }

                if (data.playlistUpdated.id !== id) {
                    return;
                }

                refetch();
            },
        });

        React.useEffect(() => {
            if (!error) {
                return;
            }

            throw error;
        }, [error]);

        return data?.playlist ?? null;
    }
    public usePlaylists() {
        const { data } = usePlaylistsQuery();
        const [playlists, setPlaylists] = React.useState<MinimalPlaylist[]>(data?.playlists ?? []);

        usePlaylistCreatedSubscription({
            onData: ({ data: { data } }) => {
                if (!data) {
                    return;
                }

                setPlaylists(playlists => [...playlists, data.playlistCreated]);
            },
        });

        usePlaylistDeletedSubscription({
            onData: ({ data: { data } }) => {
                if (!data) {
                    return;
                }

                setPlaylists(playlists => playlists.filter(playlist => playlist.id !== data.playlistDeleted));
            },
        });

        React.useEffect(() => {
            setPlaylists(data?.playlists ?? []);
        }, [data]);

        return playlists;
    }

    public async createPlaylist(name: string, musicIds?: number[]) {
        const { data } = await executeCreatePlaylist(this.client, {
            variables: {
                name,
                musicIds: musicIds ?? [],
            },
        });

        if (!data) {
            throw new Error("Failed to create playlist");
        }

        return data.createPlaylist.id;
    }
    public async deletePlaylist(id: number): Promise<void> {
        await executeDeletePlaylist(this.client, { variables: { id } });
    }

    public async addMusicToPlaylist(playlistId: number, musicIds: number[]): Promise<void> {
        await executeAddMusicsToPlaylist(this.client, { variables: { playlistId, musicIds } });
    }

    private generateHook<TArgs extends any[], TReturn>(
        func: (...args: TArgs) => Promise<TReturn>,
        messages: ToastMessages,
        action?: ToastAction | ((result: TReturn) => ToastAction | undefined),
    ) {
        return () => {
            const toast = useToast();

            return React.useCallback(
                async (...args: TArgs) => {
                    return toast.doWork({
                        work: () => func(...args),
                        persist: true,
                        loading: true,
                        messages,
                        action,
                    });
                },
                [toast],
            );
        };
    }
}
