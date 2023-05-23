/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import {
    MinimalMusicFragment,
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
}
