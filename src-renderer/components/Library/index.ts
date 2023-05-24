/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import {
    FullAlbumFragment,
    MinimalAlbumFragment,
    MinimalMusicFragment,
    useAlbumAddedSubscription,
    useAlbumQuery,
    useAlbumRemovedSubscription,
    useAlbumsQuery,
    useMusicsAddedSubscription,
    useMusicsQuery,
    useMusicsRemovedSubscription,
    useMusicsUpdatedSubscription,
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
}
