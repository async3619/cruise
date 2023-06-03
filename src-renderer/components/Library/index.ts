/* eslint-disable react-hooks/rules-of-hooks */
import _ from "lodash";
import { i18n } from "i18next";
import { z } from "zod";

import React from "react";
import { useNavigate } from "react-router-dom";

import {
    AddMusicsToPlaylistDocument,
    AddMusicsToPlaylistMutation,
    AddMusicsToPlaylistMutationVariables,
    CreatePlaylistDocument,
    CreatePlaylistFromMusicsDocument,
    CreatePlaylistFromMusicsMutation,
    CreatePlaylistFromMusicsMutationVariables,
    CreatePlaylistMutation,
    CreatePlaylistMutationVariables,
    DeletePlaylistMutationVariables,
    DeletePlaylistMutation,
    FullAlbumFragment,
    FullPlaylistFragment,
    MinimalAlbumFragment,
    MinimalArtistFragment,
    MinimalMusicFragment,
    MinimalPlaylistFragment,
    UpdatePlaylistDocument,
    UpdatePlaylistMutation,
    UpdatePlaylistMutationVariables,
    useAlbumsAddedSubscription,
    useAlbumQuery,
    useAlbumsRemovedSubscription,
    useAlbumsQuery,
    useArtistPortraitAddedSubscription,
    useArtistQuery,
    useArtistsDataUpdatedSubscription,
    useLeadArtistsQuery,
    useMusicsAddedSubscription,
    useMusicsQuery,
    useMusicsRemovedSubscription,
    useMusicsUpdatedSubscription,
    usePlaylistQuery,
    usePlaylistUpdatedSubscription,
    DeletePlaylistDocument,
    usePlaylistRemovedSubscription,
    DeleteMusicsFromPlaylistMutation,
    DeleteMusicsFromPlaylistMutationVariables,
    DeleteMusicsFromPlaylistDocument,
    NeedScanQuery,
    NeedScanDocument,
    useScanningStateChangedSubscription,
    ScanDocument,
    ScanMutation,
    ScanMutationVariables,
    useAlbumUpdatedSubscription,
    SearchSuggestionsQuery,
    SearchSuggestionsQueryVariables,
    SearchSuggestionsDocument,
    useSearchQuery,
    SearchDocument,
    SearchMode,
} from "@queries";

import { ApolloClient } from "@apollo/client";

import { DialogActionType, DialogContextValue } from "@components/Dialog/types";
import { ToastContextValues } from "@components/Toast/types";
import { InputTextDialog } from "@components/Dialog/InputTextDialog";
import { YesNoDialog } from "@components/Dialog/YesNoDialog";

export class Library {
    public constructor(
        private readonly client: ApolloClient<object>,
        private readonly dialog: DialogContextValue,
        private readonly i18n: i18n,
        private readonly toast: ToastContextValues,
    ) {}

    public useMusics() {
        const [musics, setMusics] = React.useState<MinimalMusicFragment[] | null>(null);
        const { data, loading, refetch } = useMusicsQuery();

        useMusicsAddedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.musicsAdded) {
                    return;
                }

                setMusics(musics => {
                    if (!musics) {
                        return null;
                    }

                    const oldMusics = musics.filter(
                        music => !data.musicsAdded.some(addedMusic => addedMusic.id === music.id),
                    );

                    return [...oldMusics, ...data.musicsAdded];
                });
            },
        });

        useMusicsUpdatedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.musicsUpdated) {
                    return;
                }

                setMusics(musics => {
                    if (!musics) {
                        return null;
                    }

                    const updatedMusics = data.musicsUpdated;

                    return musics.map(music => {
                        const updatedMusic = updatedMusics.find(updatedMusic => updatedMusic.id === music.id);
                        if (!updatedMusic) {
                            return music;
                        }

                        return updatedMusic;
                    });
                });
            },
        });

        useMusicsRemovedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.musicsRemoved) {
                    return;
                }

                setMusics(musics => {
                    if (!musics) {
                        return null;
                    }

                    const removedMusicIds = data.musicsRemoved;
                    return musics.filter(music => !removedMusicIds.includes(music.id));
                });
            },
        });

        React.useEffect(() => {
            if (!data?.musics || loading) {
                return;
            }

            setMusics(data.musics);
        }, [data, loading]);

        return {
            musics,
            loading,
            refetch,
        };
    }

    public useAlbums() {
        const [albums, setAlbums] = React.useState<MinimalAlbumFragment[] | null>(null);
        const { data, loading, refetch } = useAlbumsQuery();

        React.useEffect(() => {
            if (!data?.albums || loading) {
                return;
            }

            setAlbums(data.albums);
        }, [data, loading]);

        useAlbumsAddedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.albumsAdded) {
                    return;
                }

                setAlbums(albums => {
                    if (!albums) {
                        return null;
                    }

                    return [...albums, ...data.albumsAdded];
                });
            },
        });

        useAlbumsRemovedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.albumsRemoved) {
                    return;
                }

                setAlbums(albums => {
                    if (!albums) {
                        return null;
                    }

                    return _.differenceBy(albums, data.albumsRemoved, item => {
                        return typeof item === "number" ? item : item.id;
                    });
                });
            },
        });

        return {
            albums,
            loading,
            refetch,
        };
    }
    public useAlbum(id: number) {
        const [album, setAlbum] = React.useState<FullAlbumFragment | null>(null);
        const { data, loading, refetch } = useAlbumQuery({
            variables: {
                id,
            },
        });

        React.useEffect(() => {
            if (!data?.album || loading) {
                return;
            }

            setAlbum(data.album);
        }, [data, loading]);

        useAlbumUpdatedSubscription({
            variables: { id },
            fetchPolicy: "no-cache",
            onData: ({ data: { data } }) => {
                if (!data?.albumUpdated) {
                    return;
                }

                setAlbum(data.albumUpdated);
            },
        });

        return {
            album,
            loading,
            refetch,
        };
    }

    public useArtists() {
        const [artists, setArtists] = React.useState<MinimalArtistFragment[] | null>(null);
        const { data, loading, refetch } = useLeadArtistsQuery();

        React.useEffect(() => {
            if (!data?.leadArtists || loading) {
                return;
            }

            setArtists(data.leadArtists);
        }, [data, loading]);

        useArtistsDataUpdatedSubscription({
            onData: () => {
                return refetch();
            },
        });

        return {
            artists,
            loading,
            refetch,
        };
    }
    public useArtist(id: number) {
        const [artist, setArtist] = React.useState<MinimalArtistFragment | null>(null);
        const { data, loading, refetch } = useArtistQuery({
            variables: {
                id,
            },
        });

        React.useEffect(() => {
            if (!data?.artist || loading) {
                return;
            }

            setArtist(data.artist);
        }, [data, loading]);

        useArtistPortraitAddedSubscription({
            variables: {
                id,
            },
            onData: () => {
                refetch();
            },
        });

        return {
            artist,
            loading,
            refetch,
        };
    }

    public usePlaylist(id: number) {
        const navigate = useNavigate();
        const [playlist, setPlaylist] = React.useState<FullPlaylistFragment | null>(null);
        const { data, loading, refetch } = usePlaylistQuery({
            variables: {
                id,
            },
        });

        React.useEffect(() => {
            if (!data?.playlist || loading) {
                return;
            }

            setPlaylist(data.playlist);
        }, [data, loading]);

        usePlaylistUpdatedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.playlistUpdated) {
                    return;
                }

                if (data.playlistUpdated.id !== id) {
                    return;
                }

                refetch();
            },
        });

        usePlaylistRemovedSubscription({
            onData: ({ data: { data } }) => {
                if (data?.playlistRemoved !== id) {
                    return;
                }

                navigate("/musics");
            },
        });

        return {
            playlist,
            loading,
            refetch,
        };
    }

    public useScanningState() {
        const [isScanning, setIsScanning] = React.useState<boolean>(false);

        useScanningStateChangedSubscription({
            onData: ({ data: { data } }) => {
                const scanningState = data?.scanningStateChanged;
                if (typeof scanningState !== "boolean") {
                    return;
                }

                setIsScanning(scanningState);
            },
        });

        return isScanning;
    }

    public async createPlaylist() {
        const data = await this.dialog.openDialog(InputTextDialog, {
            title: this.i18n.t("dialog.createPlaylist.title"),
            content: this.i18n.t("dialog.createPlaylist.content"),
            validationSchema: z.string().nonempty(this.i18n.t("dialog.createPlaylist.validation.empty")),
        });

        if (data.type !== DialogActionType.Submit) {
            return;
        }

        const playlistName = data.value;
        await this.toast.doWork({
            messages: {
                success: this.i18n.t("toast.createPlaylist.success"),
                error: this.i18n.t("toast.createPlaylist.error"),
                pending: this.i18n.t("toast.createPlaylist.pending"),
            },
            work: async () => {
                const { data } = await this.client.mutate<CreatePlaylistMutation, CreatePlaylistMutationVariables>({
                    mutation: CreatePlaylistDocument,
                    variables: {
                        input: {
                            name: playlistName,
                        },
                    },
                });

                if (!data?.createPlaylist) {
                    throw new Error();
                }

                return data.createPlaylist;
            },
            action: data => ({
                label: this.i18n.t("toast.createPlaylist.actionText"),
                to: `/playlists/${data.id}`,
            }),
        });
    }
    public addMusicsToPlaylist(playlistId: number, musics: ReadonlyArray<MinimalMusicFragment>) {
        return this.toast.doWork({
            messages: {
                success: this.i18n.t("toast.addMusicsToPlaylist.success"),
                error: this.i18n.t("toast.addMusicsToPlaylist.error"),
                pending: this.i18n.t("toast.addMusicsToPlaylist.pending"),
            },
            work: () => {
                return this.client.mutate<AddMusicsToPlaylistMutation, AddMusicsToPlaylistMutationVariables>({
                    mutation: AddMusicsToPlaylistDocument,
                    variables: {
                        playlistId,
                        musicIds: musics.map(music => music.id),
                    },
                });
            },
            action: {
                label: this.i18n.t("toast.addMusicsToPlaylist.actionText"),
                to: `/playlists/${playlistId}`,
            },
        });
    }
    public async createPlaylistWithMusics(musics: ReadonlyArray<MinimalMusicFragment>) {
        const result = await this.dialog.openDialog(InputTextDialog, {
            title: this.i18n.t("dialog.createPlaylist.title"),
            content: this.i18n.t("dialog.createPlaylist.content"),
            validationSchema: z.string().nonempty(),
        });

        if (result.type !== DialogActionType.Submit) {
            return;
        }

        await this.toast.doWork({
            messages: {
                success: this.i18n.t("toast.createPlaylist.success"),
                error: this.i18n.t("toast.createPlaylist.error"),
                pending: this.i18n.t("toast.createPlaylist.pending"),
            },
            work: async () => {
                const { data } = await this.client.mutate<
                    CreatePlaylistFromMusicsMutation,
                    CreatePlaylistFromMusicsMutationVariables
                >({
                    mutation: CreatePlaylistFromMusicsDocument,
                    variables: {
                        input: {
                            name: result.value,
                        },
                        musicIds: musics.map(music => music.id),
                    },
                });

                if (!data?.createPlaylistFromMusics) {
                    throw new Error();
                }

                return data.createPlaylistFromMusics;
            },
            action: data => ({
                label: this.i18n.t("toast.createPlaylist.actionText"),
                to: `/playlists/${data.id}`,
            }),
        });
    }

    public async renamePlaylist(playlist: MinimalPlaylistFragment) {
        const data = await this.dialog.openDialog(InputTextDialog, {
            title: this.i18n.t("dialog.renamePlaylist.title"),
            content: this.i18n.t("dialog.renamePlaylist.content"),
            validationSchema: z.string().nonempty(this.i18n.t("dialog.renamePlaylist.validation.empty")),
            defaultValue: playlist.name,
        });

        if (data.type !== DialogActionType.Submit) {
            return;
        }

        return this.toast.doWork({
            messages: {
                success: this.i18n.t("toast.updatePlaylist.success"),
                error: this.i18n.t("toast.updatePlaylist.error"),
                pending: this.i18n.t("toast.updatePlaylist.pending"),
            },
            work: () => {
                return this.client.mutate<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>({
                    mutation: UpdatePlaylistDocument,
                    variables: {
                        id: playlist.id,
                        input: {
                            name: data.value,
                        },
                    },
                });
            },
        });
    }
    public async deletePlaylist(playlist: MinimalPlaylistFragment) {
        const data = await this.dialog.openDialog(YesNoDialog, {
            title: this.i18n.t("dialog.deletePlaylist.title"),
            content: this.i18n.t("dialog.deletePlaylist.content"),
            positiveLabel: this.i18n.t("dialog.deletePlaylist.confirm"),
            positiveColor: "error",
        });

        if (data.type !== DialogActionType.Positive) {
            return;
        }

        return this.toast.doWork({
            messages: {
                success: this.i18n.t("toast.deletePlaylist.success"),
                error: this.i18n.t("toast.deletePlaylist.error"),
                pending: this.i18n.t("toast.deletePlaylist.pending"),
            },
            work: () => {
                return this.client.mutate<DeletePlaylistMutation, DeletePlaylistMutationVariables>({
                    mutation: DeletePlaylistDocument,
                    variables: {
                        id: playlist.id,
                    },
                });
            },
        });
    }
    public async deleteMusicsFromPlaylist(playlist: MinimalPlaylistFragment, indices: ReadonlyArray<number>) {
        return this.toast.doWork({
            messages: {
                success: this.i18n.t("toast.deleteFromPlaylist.success"),
                error: this.i18n.t("toast.deleteFromPlaylist.error"),
                pending: this.i18n.t("toast.deleteFromPlaylist.pending"),
            },
            work: () => {
                return this.client.mutate<DeleteMusicsFromPlaylistMutation, DeleteMusicsFromPlaylistMutationVariables>({
                    mutation: DeleteMusicsFromPlaylistDocument,
                    variables: {
                        playlistId: playlist.id,
                        indices: [...indices],
                    },
                });
            },
        });
    }

    public async needScan() {
        const { data } = await this.client.query<NeedScanQuery>({
            query: NeedScanDocument,
        });

        return data.needScan;
    }
    public async scan() {
        return this.client.mutate<ScanMutation, ScanMutationVariables>({
            mutation: ScanDocument,
        });
    }

    public async getSearchSuggestions(query: string, limit: number) {
        const { data } = await this.client.query<SearchSuggestionsQuery, SearchSuggestionsQueryVariables>({
            query: SearchSuggestionsDocument,
            variables: {
                query,
                limit,
            },
        });

        return data.searchSuggestions;
    }

    public useSearch(query: string, mode: SearchMode, enabled = true) {
        return useSearchQuery({
            query: SearchDocument,
            variables: {
                query,
                mode,
            },
            skip: !enabled,
        });
    }
}
