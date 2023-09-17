import React from "react";

import { AlbumArtistView } from "@components/AlbumArtist/View";
import { useAlbumSelection } from "@components/Selection";
import { Root } from "@components/AlbumArtist/List.styles";

import { MinimalAlbum } from "@utils/types";

export interface AlbumArtistListProps {
    items: MinimalAlbum[];
    onPlayAlbum(album: MinimalAlbum): void;
}

export function AlbumArtistList({ items, onPlayAlbum }: AlbumArtistListProps) {
    const selection = useAlbumSelection();
    const selectedIndices = selection?.selectedIndices || [];

    const handleSelectChange = React.useCallback(
        (album: MinimalAlbum, checked: boolean) => {
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
                    onPlay={onPlayAlbum}
                    onSelectChange={handleSelectChange}
                />
            ))}
        </Root>
    );
}
