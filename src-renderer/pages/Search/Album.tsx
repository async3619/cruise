import React from "react";

import { SearchProps } from "@pages/Search";
import { CardList } from "@components/CardList";

export function AlbumSearch({ search, onPlay }: SearchProps) {
    const { albums } = search;

    return <CardList direction="vertical" items={albums} onPlay={onPlay} />;
}
