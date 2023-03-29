import React from "react";

import ArtistList from "@components/UI/ArtistList";
import MusicsPage from "@components/Page/Musics";

import {
    ArtistAlbumMusicsDocument,
    ArtistAlbumMusicsQuery,
    ArtistAlbumMusicsQueryVariables,
    useLeadArtistAddedSubscription,
    useLeadArtistRemovedSubscription,
    useLeadArtistsQuery,
} from "@queries";

import { ArtistListItem as ArtistListItemType, BasePageProps } from "@utils/types";

import { Root } from "@pages/Artists.styles";

export default function Artists({ player, client, navigate }: BasePageProps) {
    const { data } = useLeadArtistsQuery();
    const [leadArtists, setLeadArtists] = React.useState<ArtistListItemType[] | null>(null);

    React.useEffect(() => {
        if (data?.leadArtists) {
            setLeadArtists(data.leadArtists);
        }
    }, [data]);

    useLeadArtistAddedSubscription({
        fetchPolicy: "no-cache",
        onData: ({ data: { data } }) => {
            if (!data) {
                return;
            }

            setLeadArtists(leadArtists => {
                if (!leadArtists) {
                    return null;
                }

                return [...leadArtists, data.leadArtistAdded];
            });
        },
    });

    useLeadArtistRemovedSubscription({
        fetchPolicy: "no-cache",
        onData: ({ data: { data } }) => {
            if (!data) {
                return;
            }

            setLeadArtists(leadArtists => {
                if (!leadArtists) {
                    return null;
                }

                return leadArtists.filter(artist => artist.id !== data.leadArtistRemoved);
            });
        },
    });

    const handlePlay = async (item: ArtistListItemType) => {
        const { data } = await client.query<ArtistAlbumMusicsQuery, ArtistAlbumMusicsQueryVariables>({
            query: ArtistAlbumMusicsDocument,
            variables: {
                artistId: item.id,
            },
        });

        if (!data?.artist) {
            //TODO: Throw error
            return;
        }

        const musics = data.artist.albums.flatMap(album => album.musics);
        await player.play(musics, musics[0]);
    };

    const handleClick = (item: ArtistListItemType) => {
        navigate(`/artists/${item.id}`);
    };

    return (
        <MusicsPage title="Artists" player={player}>
            <Root>{leadArtists && <ArtistList items={leadArtists} onPlay={handlePlay} onClick={handleClick} />}</Root>
        </MusicsPage>
    );
}
