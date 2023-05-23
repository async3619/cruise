/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import { MinimalMusicFragment, useMusicsAddedSubscription, useMusicsQuery } from "@queries";

export class Library {
    public useMusics() {
        const [musics, setMusics] = React.useState<MinimalMusicFragment[] | null>(null);

        const { data, loading, refetch } = useMusicsQuery();
        useMusicsAddedSubscription({
            onData: ({ data: { data } }) => {
                if (!musics || !data?.musicsAdded) {
                    return;
                }

                setMusics([...musics, ...data.musicsAdded]);
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
