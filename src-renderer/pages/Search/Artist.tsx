import React from "react";

import { SearchProps } from "@pages/Search";
import { CardList } from "@components/CardList";

export function ArtistSearch({ search, onPlay }: SearchProps) {
    const { artists } = search;

    return <CardList items={artists} direction="vertical" onPlay={onPlay} />;
}
