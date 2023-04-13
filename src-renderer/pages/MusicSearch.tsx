import React from "react";

import { Typography } from "@mui/material";

import Page from "@components/Page";
import MusicList from "@components/UI/MusicList";

import { Section, SectionTitle } from "@pages/Search.styles";

import { BasePageProps, MusicListItem } from "@utils/types";

import { useSearchMusicsQuery } from "@queries";

export default function MusicSearch({ params, player }: BasePageProps<{ query: string }>) {
    if (!params.query) {
        throw new Error("Query is not provided");
    }

    const { data } = useSearchMusicsQuery({
        variables: {
            query: params.query,
        },
    });

    if (!data) {
        return <Page title={`"${params.query}" Search Result`} />;
    }

    const {
        search: { musics },
    } = data;

    const handleMusicPlay = (item: MusicListItem) => {
        player.play([item], item);
    };

    return (
        <Page title={`Music search results of "${params.query}"`}>
            <Section>
                <SectionTitle>
                    <Typography fontWeight={800} variant="h6">
                        Results ({musics.length})
                    </Typography>
                </SectionTitle>
                <MusicList items={musics} onPlay={handleMusicPlay} />
            </Section>
        </Page>
    );
}
