/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import { ApolloClient } from "@apollo/client";
import {
    executeCreatePlaylist,
    usePlaylistCreatedSubscription,
    usePlaylistQuery,
    usePlaylistsQuery,
} from "@graphql/queries";
import { MinimalPlaylist } from "@utils/types";

export class Library {
    private readonly client: ApolloClient<object>;

    public constructor(client: ApolloClient<object>) {
        this.client = client;
    }

    public usePlaylist(id: number) {
        const { data, error } = usePlaylistQuery({ variables: { id } });

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

        React.useEffect(() => {
            setPlaylists(data?.playlists ?? []);
        }, [data]);

        return playlists;
    }

    public async createPlaylist(name: string, musicIds?: number[]): Promise<void> {
        await executeCreatePlaylist(this.client, {
            variables: {
                name,
                musicIds: musicIds ?? [],
            },
        });
    }
}
