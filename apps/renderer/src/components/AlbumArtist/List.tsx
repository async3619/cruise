import React from "react";

import { AlbumArtistView } from "@components/AlbumArtist/View";
import { useAlbumSelection, useArtistSelection } from "@components/Selection";
import { Root } from "@components/AlbumArtist/List.styles";

import { FullArtist, MinimalAlbum } from "@utils/types";

export interface AlbumListProps {
    type: "album";
    items: Array<MinimalAlbum>;
    onPlayItem(album: MinimalAlbum): void;
}

export interface ArtistListProps {
    type: "artist";
    items: Array<FullArtist>;
    onPlayItem(artist: FullArtist): void;
}

export type AlbumArtistListProps = AlbumListProps | ArtistListProps;

export function AlbumArtistList({ items, onPlayItem, type }: AlbumArtistListProps) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const selection = type === "album" ? useAlbumSelection() : useArtistSelection();
    const selectedIndices = selection?.selectedIndices || [];

    const handleSelectChange = React.useCallback(
        (album: MinimalAlbum | FullArtist, checked: boolean) => {
            if (!selection) {
                return;
            }

            const index = items.findIndex(item => item.id === album.id);
            if (index < 0) {
                return;
            }

            const newSelection = [...selection.selectedIndices];
            if (checked) {
                newSelection.push(index);
            } else {
                newSelection.splice(newSelection.indexOf(index), 1);
            }

            selection.setSelection(newSelection);
        },
        [items, selection],
    );

    return (
        <Root data-testid="AlbumArtistList">
            {items.map((item, index) => (
                <AlbumArtistView
                    selected={selectedIndices.includes(index)}
                    key={item.id}
                    item={item}
                    onPlay={onPlayItem}
                    onSelectChange={handleSelectChange}
                />
            ))}
        </Root>
    );
}
