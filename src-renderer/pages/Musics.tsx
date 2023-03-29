import _ from "lodash";
import React from "react";

import MusicsPage from "@components/Page/Musics";
import MusicList from "@components/UI/MusicList";

import {
    useMusicAddedSubscription,
    useMusicRemovedSubscription,
    useMusicsQuery,
    useMusicsUpdatedSubscription,
} from "@queries";

import { Root } from "@pages/Musics.styles";

import { BasePageProps, MusicListItem } from "@utils/types";

export default function Musics({ player }: BasePageProps) {
    const { currentMusic, play } = player;
    const { data } = useMusicsQuery();
    const [musics, setMusics] = React.useState<MusicListItem[] | null>(null);

    React.useEffect(() => {
        if (data?.musics) {
            setMusics(data.musics);
        }
    }, [data]);

    useMusicAddedSubscription({
        fetchPolicy: "network-only",
        onData: ({ data: { data } }) => {
            if (!data?.musicAdded) {
                return;
            }

            setMusics(prev => {
                if (!prev) {
                    return null;
                }

                return [...prev, data.musicAdded];
            });
        },
    });

    useMusicsUpdatedSubscription({
        fetchPolicy: "network-only",
        onData: ({ data: { data } }) => {
            if (!data?.musicsUpdated) {
                return;
            }

            setMusics(prev => {
                if (!prev) {
                    return null;
                }

                const updatedMusicMap = _.chain(data.musicsUpdated).keyBy("id").value();
                return prev.map(music => {
                    if (music.id in updatedMusicMap) {
                        return updatedMusicMap[music.id];
                    }

                    return music;
                });
            });
        },
    });

    useMusicRemovedSubscription({
        fetchPolicy: "network-only",
        onData: ({ data: { data } }) => {
            if (typeof data?.musicRemoved !== "number") {
                return;
            }

            setMusics(prev => {
                if (!prev) {
                    return null;
                }

                return prev.filter(music => music.id !== data.musicRemoved);
            });
        },
    });

    const handlePlay = (item: MusicListItem) => {
        if (!data?.musics) {
            return;
        }

        play(data.musics, item);
    };

    return (
        <MusicsPage title="Musics" player={player}>
            <Root>{musics && <MusicList activeItem={currentMusic} onPlay={handlePlay} items={musics} />}</Root>
        </MusicsPage>
    );
}
