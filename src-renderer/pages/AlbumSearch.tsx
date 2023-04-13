import React from "react";

import { Typography } from "@mui/material";

import SearchPage from "@components/Page/SearchPage";
import AlbumList from "@components/UI/AlbumList";

import { Section, SectionTitle } from "@pages/Search.styles";

import { AlbumListItem as AlbumListItemType, BasePageProps } from "@utils/types";
import { useSearchAlbumsQuery } from "@queries";

export default function AlbumSearch({ params, player, navigate }: BasePageProps<{ query: string }>) {
    const handleAlbumPlay = (item: AlbumListItemType) => {
        player.play(item.musics, item.musics[0]);
    };
    const handleAlbumClick = (item: AlbumListItemType) => {
        navigate(`/albums/${item.id}`);
    };

    return (
        <SearchPage
            useQuery={useSearchAlbumsQuery}
            query={params.query}
            title={`Album search results for "${params.query}"`}
        >
            {({ search: { albums } }) => (
                <Section>
                    <SectionTitle>
                        <Typography fontWeight={800} variant="h6">
                            Results ({albums.length})
                        </Typography>
                    </SectionTitle>
                    <AlbumList items={albums} onPlay={handleAlbumPlay} onClick={handleAlbumClick} />
                </Section>
            )}
        </SearchPage>
    );
}
