/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import {
    FullAlbumFragment,
    FullPlaylistFragment,
    MinimalAlbumFragment,
    MinimalArtistFragment,
    MinimalMusicFragment,
    MinimalPlaylistFragment,
    useAlbumAddedSubscription,
    useAlbumQuery,
    useAlbumRemovedSubscription,
    useAlbumsQuery,
    useArtistPortraitAddedSubscription,
    useArtistQuery,
    useCreatePlaylistMutation,
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
} from "@queries";

export class Library {
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
        const [create] = useCreatePlaylistMutation();

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

        return {
            playlists,
            loading,
            refetch,
            create,
        };
    }
    public usePlaylist(id: number) {
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

        return {
            playlist,
            loading,
            refetch,
        };
    }
}
