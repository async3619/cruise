import React from "react";

import { Root } from "@components/AlbumArtist/List.styles";

import { MinimalAlbum } from "@utils/types";
import { AlbumArtistView } from "@components/AlbumArtist/View";

export interface AlbumArtistListProps {
    items: MinimalAlbum[];
    onPlayAlbum(album: MinimalAlbum): void;
}

export function AlbumArtistList({ items, onPlayAlbum }: AlbumArtistListProps) {
    return (
        <Root data-testid="AlbumArtistList">
            {items.map(item => (
                <AlbumArtistView key={item.id} item={item} onPlay={onPlayAlbum} />
            ))}
        </Root>
    );
}
