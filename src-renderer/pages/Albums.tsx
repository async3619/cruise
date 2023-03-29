import React from "react";
import * as _ from "lodash";

import MusicsPage from "@components/Page/Musics";
import AlbumList from "@components/UI/AlbumList";

import {
    useAlbumAddedSubscription,
    useAlbumRemovedSubscription,
    useAlbumsQuery,
    useAlbumsUpdatedSubscription,
} from "@queries";

import { Root } from "@pages/Albums.styles";

import { AlbumListItem, BasePageProps } from "@utils/types";

export default function Albums({ player, navigate }: BasePageProps) {
    const { data } = useAlbumsQuery();
    const [albums, setAlbums] = React.useState<AlbumListItem[] | null>(null);

    useAlbumAddedSubscription({
        fetchPolicy: "no-cache",
        onData: ({ data: { data } }) => {
            if (!data) {
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
        fetchPolicy: "no-cache",
        onData: ({ data: { data } }) => {
            if (typeof data === "undefined") {
                return;
            }

            setAlbums(albums => {
                if (!albums) {
                    return null;
                }

                return albums.filter(a => a.id !== data.albumRemoved);
            });
        },
    });

    useAlbumsUpdatedSubscription({
        fetchPolicy: "no-cache",
        onData: ({ data: { data } }) => {
            if (!data) {
                return;
            }

            const updatedAlbumMap = _.chain(data.albumsUpdated).keyBy("id").value();
            setAlbums(albums => {
                if (!albums) {
                    return null;
                }

                return albums.map(a => {
                    const updatedAlbum = updatedAlbumMap[a.id];
                    if (updatedAlbum) {
                        return updatedAlbum;
                    }

                    return a;
                });
            });
        },
    });

    React.useEffect(() => {
        if (!data?.albums) {
            return;
        }

        setAlbums(data.albums);
    }, [data]);

    const handlePlay = async (album: AlbumListItem) => {
        const musics = _.orderBy(album.musics, m => m.track ?? m.id, "asc");
        await player.play(musics, musics[0]);
    };

    const handleClick = (album: AlbumListItem) => {
        navigate(`/albums/${album.id}`);
    };

    return (
        <MusicsPage title="Albums" player={player}>
            <Root>{albums && <AlbumList onClick={handleClick} onPlay={handlePlay} items={albums} />}</Root>
        </MusicsPage>
    );
}
