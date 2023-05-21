/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import { MinimalMusicFragment, useMusicAddedSubscription, useMusicsQuery } from "@queries";

export class Library {
    public useMusics() {
        const [musics, setMusics] = React.useState<MinimalMusicFragment[] | null>(null);

        const { data, loading, refetch } = useMusicsQuery();
        useMusicAddedSubscription({
            onData: ({ data: { data } }) => {
                if (!musics || !data?.musicAdded) {
                    return;
                }

                setMusics([...musics, data.musicAdded]);
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
