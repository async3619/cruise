import React from "react";

import { SearchProps } from "@pages/Search";
import { MusicList } from "@components/MusicList";

export function MusicSearch({ search }: SearchProps) {
    const { musics } = search;

    return <MusicList items={musics} />;
}
