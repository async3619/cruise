import React from "react";

import { Typography } from "@mui/material";

import SearchPage from "@components/Page/SearchPage";
import MusicList from "@components/UI/MusicList";

import { Section, SectionTitle } from "@pages/Search.styles";

import { BasePageProps, MusicListItem } from "@utils/types";

import { useSearchMusicsQuery } from "@queries";

export default function MusicSearch({ params, player }: BasePageProps<{ query: string }>) {
    const handleMusicPlay = (item: MusicListItem) => {
        player.play([item], item);
    };

    return (
        <SearchPage
            useQuery={useSearchMusicsQuery}
            query={params.query}
            title={`Music search results for "${params.query}"`}
        >
            {({ search: { musics } }) => (
                <Section>
                    <SectionTitle>
                        <Typography fontWeight={800} variant="h6">
                            Results ({musics.length})
                        </Typography>
                    </SectionTitle>
                    <MusicList items={musics} onPlay={handleMusicPlay} />
                </Section>
            )}
        </SearchPage>
    );
}
