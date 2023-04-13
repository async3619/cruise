import React from "react";

import { Typography } from "@mui/material";

import Page from "@components/Page";
import AlbumList from "@components/UI/AlbumList";

import { Section, SectionTitle } from "@pages/Search.styles";

import { useSearchAlbumsQuery } from "@queries";

import { AlbumListItem as AlbumListItemType, BasePageProps } from "@utils/types";

export default function AlbumSearch({ params, player, navigate }: BasePageProps<{ query: string }>) {
    if (!params.query) {
        throw new Error("Query is not provided");
    }

    const { data } = useSearchAlbumsQuery({
        variables: {
            query: params.query,
        },
    });

    if (!data) {
        return <Page title={`"${params.query}" Search Result`} />;
    }

    const {
        search: { albums },
    } = data;

    const handleAlbumPlay = (item: AlbumListItemType) => {
        player.play(item.musics, item.musics[0]);
    };
    const handleAlbumClick = (item: AlbumListItemType) => {
        navigate(`/albums/${item.id}`);
    };

    return (
        <Page title={`Album search results of "${params.query}"`}>
            <Section>
                <SectionTitle>
                    <Typography fontWeight={800} variant="h6">
                        Results ({albums.length})
                    </Typography>
                </SectionTitle>
                <AlbumList items={albums} onPlay={handleAlbumPlay} onClick={handleAlbumClick} />
            </Section>
        </Page>
    );
}
