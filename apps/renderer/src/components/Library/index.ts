/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { DialogActionType, DialogContextValues, InputTextDialog, ToastContextValues, YesNoDialog } from "ui";
import { TFunction } from "i18next";
import { Fn } from "types";
import { z } from "zod";

import { ApolloClient } from "@apollo/client";
import {
    executeAddMusicsToPlaylist,
    executeClearPlaylist,
    executeCreatePlaylist,
    executeDeletePlaylist,
    executeDeletePlaylistItems,
    executeRenamePlaylist,
    usePlaylistCreatedSubscription,
    usePlaylistDeletedSubscription,
    usePlaylistQuery,
    usePlaylistsQuery,
    usePlaylistUpdatedSubscription,
} from "@graphql/queries";
import { MinimalPlaylist } from "@utils/types";

export class Library {
    private readonly client: ApolloClient<object>;
    private readonly t: TFunction<"ns1", undefined>;
    private readonly navigate: Fn<[path: string]>;
    private readonly toast: ToastContextValues;
    private readonly dialog: DialogContextValues;

    public constructor(
        client: ApolloClient<object>,
        translator: TFunction<"ns1", undefined>,
        navigate: Fn<[path: string]>,
        toast: ToastContextValues,
        dialog: DialogContextValues,
    ) {
        this.client = client;
        this.t = translator;
        this.navigate = navigate;
        this.toast = toast;
        this.dialog = dialog;
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

                return refetch();
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

        usePlaylistUpdatedSubscription({
            onData: ({ data: { data } }) => {
                if (!data) {
                    return;
                }

                setPlaylists(playlists =>
                    playlists.map(playlist =>
                        playlist.id === data.playlistUpdated.id ? data.playlistUpdated : playlist,
                    ),
                );
            },
        });

        React.useEffect(() => {
            setPlaylists(data?.playlists ?? []);
        }, [data]);

        return playlists;
    }

    public async createPlaylist(musicIds?: number[]) {
        const result = await this.dialog.openDialog(InputTextDialog, {
            title: this.t("playlist.create.title"),
            description: this.t("playlist.create.description"),
            placeholder: this.t("playlist.create.placeholder"),
            positiveLabel: this.t("common.create"),
            negativeLabel: this.t("common.cancel"),
            validationSchema: z
                .string()
                .nonempty(this.t("playlist.create.errors.title-required"))
                .max(20, this.t("playlist.create.errors.title-too-long")),
        });

        if (result.type !== DialogActionType.Submit) {
            return;
        }

        await this.toast.doWork({
            work: async () => {
                const { data } = await executeCreatePlaylist(this.client, {
                    variables: {
                        name: result.value,
                        musicIds: musicIds ?? [],
                    },
                });

                if (!data) {
                    throw new Error("Failed to create playlist");
                }

                return data.createPlaylist.id;
            },
            persist: true,
            loading: true,
            messages: {
                pending: this.t("playlist.create.pending"),
                success: this.t("playlist.create.success"),
                error: this.t("playlist.create.error"),
            },
            action: id => ({
                label: this.t("common.open"),
                onClick: () => this.navigate(`/playlists/${id}`),
            }),
        });
    }
    public async deletePlaylist(playlist: MinimalPlaylist, confirmation = true) {
        if (confirmation) {
            const result = await this.dialog.openDialog(YesNoDialog, {
                title: this.t("playlist.delete.title"),
                description: this.t("playlist.delete.description", {
                    name: playlist?.name ?? "",
                }),
                positiveLabel: this.t("common.delete"),
                negativeLabel: this.t("common.cancel"),
                positiveColor: "error",
            });

            if (result.type !== DialogActionType.Positive) {
                return false;
            }
        }

        await this.toast.doWork({
            work: () => executeDeletePlaylist(this.client, { variables: { id: playlist.id } }),
            loading: true,
            persist: true,
            messages: {
                pending: this.t("playlist.delete.pending"),
                success: this.t("playlist.delete.success"),
                error: this.t("playlist.delete.error"),
            },
        });

        return true;
    }
    public async clearPlaylist(playlist: MinimalPlaylist, confirmation = true) {
        if (confirmation) {
            const result = await this.dialog.openDialog(YesNoDialog, {
                title: this.t("playlist.clear.title"),
                description: this.t("playlist.clear.description", {
                    name: playlist?.name ?? "",
                }),
                positiveLabel: this.t("common.clear"),
                negativeLabel: this.t("common.cancel"),
                positiveColor: "error",
            });

            if (result.type !== DialogActionType.Positive) {
                return false;
            }
        }

        await this.toast.doWork({
            work: () => executeClearPlaylist(this.client, { variables: { id: playlist.id } }),
            loading: true,
            persist: true,
            messages: {
                pending: this.t("playlist.clear.pending"),
                success: this.t("playlist.clear.success"),
                error: this.t("playlist.clear.error"),
            },
        });

        return true;
    }
    public async renamePlaylist(playlist: MinimalPlaylist) {
        const result = await this.dialog.openDialog(InputTextDialog, {
            title: this.t("playlist.rename.title"),
            description: this.t("playlist.rename.description"),
            placeholder: this.t("playlist.rename.placeholder"),
            positiveLabel: this.t("common.rename"),
            negativeLabel: this.t("common.cancel"),
            validationSchema: z
                .string()
                .nonempty(this.t("playlist.rename.errors.title-required"))
                .max(20, this.t("playlist.rename.errors.title-too-long")),
            defaultValue: playlist.name,
        });

        if (result.type !== DialogActionType.Submit) {
            return;
        }

        await this.toast.doWork({
            work: () => executeRenamePlaylist(this.client, { variables: { id: playlist.id, name: result.value } }),
            loading: true,
            persist: true,
            messages: {
                pending: this.t("playlist.rename.pending"),
                success: this.t("playlist.rename.success"),
                error: this.t("playlist.rename.error"),
            },
        });
    }
    public async deletePlaylistItems(playlistId: number, indices: number[]) {
        await this.toast.doWork({
            work: () => executeDeletePlaylistItems(this.client, { variables: { playlistId, indices } }),
            loading: true,
            persist: true,
            messages: {
                pending: this.t("playlist.delete-items.pending"),
                success: this.t("playlist.delete-items.success"),
                error: this.t("playlist.delete-items.error"),
            },
        });
    }

    public async addMusicsToPlaylist(playlistId: number, musicIds: number[]): Promise<void> {
        await this.toast.doWork({
            work: () => executeAddMusicsToPlaylist(this.client, { variables: { playlistId, musicIds } }),
            persist: true,
            loading: true,
            messages: {
                success: this.t("playlist.add-musics.success"),
                error: this.t("playlist.add-musics.error"),
                pending: this.t("playlist.add-musics.pending"),
            },
        });
    }
}
