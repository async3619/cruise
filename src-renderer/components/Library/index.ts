/* eslint-disable react-hooks/rules-of-hooks */
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
    useAlbumAddedSubscription,
    useAlbumQuery,
    useAlbumRemovedSubscription,
    useAlbumsQuery,
    useArtistPortraitAddedSubscription,
    useArtistQuery,
    useLeadArtistAddedSubscription,
    useLeadArtistRemovedSubscription,
    useLeadArtistsQuery,
    useMusicsAddedSubscription,
    useMusicsQuery,
    useMusicsRemovedSubscription,
    useMusicsUpdatedSubscription,
    usePlaylistAddedSubscription,
    usePlaylistQuery,
    usePlaylistsQuery,
    usePlaylistUpdatedSubscription,
    DeletePlaylistDocument,
    usePlaylistRemovedSubscription,
} from "@queries";

import { ApolloClient } from "@apollo/client";

import { DialogActionType, DialogContextValue } from "@components/Dialog/types";
import { InputTextDialog } from "@components/Dialog/InputTextDialog";
import { YesNoDialog } from "@components/Dialog/YesNoDialog";

export class Library {
    public constructor(
        private readonly client: ApolloClient<object>,
        private readonly dialog: DialogContextValue,
        private readonly i18n: i18n,
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

        useAlbumAddedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.albumAdded) {
                    return;
                }

                setAlbums(albums => {
                    if (!albums) {
                        return null;
                    }

                    return [...albums, data.albumAdded];
                });
            },
        });

        useAlbumRemovedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.albumRemoved) {
                    return;
                }

                setAlbums(albums => {
                    if (!albums) {
                        return null;
                    }

                    return albums.filter(album => album.id !== data.albumRemoved);
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

        useLeadArtistAddedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.leadArtistAdded) {
                    return;
                }

                setArtists(artists => {
                    if (!artists) {
                        return null;
                    }

                    return [...artists, data.leadArtistAdded];
                });
            },
        });

        useLeadArtistRemovedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.leadArtistRemoved) {
                    return;
                }

                setArtists(artists => {
                    if (!artists) {
                        return null;
                    }

                    return artists.filter(artist => artist.id !== data.leadArtistRemoved);
                });
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

    public usePlaylists() {
        const [playlists, setPlaylists] = React.useState<MinimalPlaylistFragment[] | null>(null);
        const { data, loading, refetch } = usePlaylistsQuery();

        React.useEffect(() => {
            if (!data?.playlists || loading) {
                return;
            }

            setPlaylists(data.playlists);
        }, [data, loading]);

        usePlaylistAddedSubscription({
            onData: ({ data: { data } }) => {
                if (!data?.playlistAdded) {
                    return;
                }

                setPlaylists(playlists => {
                    if (!playlists) {
                        return null;
                    }

                    return [...playlists, data.playlistAdded];
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

                    return playlists.map(p => {
                        if (p.id !== data.playlistUpdated.id) {
                            return p;
                        }

                        return data.playlistUpdated;
                    });
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

        return {
            playlists,
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

    public async createPlaylist() {
        const data = await this.dialog.openDialog(InputTextDialog, {
            title: this.i18n.t("dialog.createPlaylist.title"),
            content: this.i18n.t("dialog.createPlaylist.content"),
            validationSchema: z.string().nonempty(this.i18n.t("dialog.createPlaylist.validation.empty")),
        });

        if (data.type !== DialogActionType.Submit) {
            return;
        }

        return this.client.mutate<CreatePlaylistMutation, CreatePlaylistMutationVariables>({
            mutation: CreatePlaylistDocument,
            variables: {
                input: {
                    name: data.value,
                },
            },
        });
    }
    public addMusicsToPlaylist(playlistId: number, musics: MinimalMusicFragment[]) {
        return this.client.mutate<AddMusicsToPlaylistMutation, AddMusicsToPlaylistMutationVariables>({
            mutation: AddMusicsToPlaylistDocument,
            variables: {
                playlistId,
                musicIds: musics.map(music => music.id),
            },
        });
    }
    public async createPlaylistWithMusics(musics: MinimalMusicFragment[]) {
        const result = await this.dialog.openDialog(InputTextDialog, {
            title: this.i18n.t("dialog.createPlaylist.title"),
            content: this.i18n.t("dialog.createPlaylist.content"),
            validationSchema: z.string().nonempty(),
        });

        if (result.type !== DialogActionType.Submit) {
            return;
        }

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

        return data?.createPlaylistFromMusics;
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

        return this.client.mutate<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>({
            mutation: UpdatePlaylistDocument,
            variables: {
                id: playlist.id,
                input: {
                    name: data.value,
                },
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

        return this.client.mutate<DeletePlaylistMutation, DeletePlaylistMutationVariables>({
            mutation: DeletePlaylistDocument,
            variables: {
                id: playlist.id,
            },
        });
    }
}
