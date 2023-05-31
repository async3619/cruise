import React from "react";

import { Box } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { usePlayer } from "@components/Player/Provider";
import { VirtualizedList } from "@components/VirtualizedList";
import { AlbumArt, Cell, Item, Label, LinkLabel, SelectedItem } from "@components/MusicList.styles";

import { useLayoutMusics } from "@components/Layout";

import { ArtistIdNameFragment, MinimalMusicFragment } from "@queries";

export interface MusicListProps {
    items: ReadonlyArray<MinimalMusicFragment>;
    withTrackNumber?: boolean;
    selectable?: boolean;
}

export function MusicList({ items, withTrackNumber, selectable }: MusicListProps) {
    const { playPlaylist, playingMusic } = usePlayer();
    const layoutMusics = useLayoutMusics();

    React.useEffect(() => {
        layoutMusics.setItems(items);
    }, [layoutMusics, items]);

    const handlePlay = (index: number) => {
        playPlaylist(items, index);
    };
    const handleItemClick = (index: number, shift: boolean) => {
        if (!selectable) {
            return;
        }

        if (!shift) {
            layoutMusics.selectMusic(index);
        } else {
            const selectedIndices = [...layoutMusics.selectedIndices];

            // get the closest selected index using lodash
            const closestIndex =
                selectedIndices.length > 0
                    ? selectedIndices.reduce((prev, curr) => {
                          return Math.abs(curr - index) < Math.abs(prev - index) ? curr : prev;
                      })
                    : 0;

            const start = Math.min(closestIndex, index);
            const end = Math.max(closestIndex, index);
            const targetIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);

            layoutMusics.selectMusic(targetIndices);
        }
    };

    const renderArtist = (music: MinimalMusicFragment) => {
        const artists: Array<ArtistIdNameFragment> | string =
            music.album?.leadArtists || music.artists || music.albumArtists;

        if (Array.isArray(artists)) {
            return artists.map(artist => (
                <LinkLabel key={artist.id} to={`/artists/${artist.id}`}>
                    <span>{artist.name}</span>
                </LinkLabel>
            ));
        }

        return (
            <Label>
                <span>{artists}</span>
            </Label>
        );
    };

    return (
        <VirtualizedList rowHeight={52} items={items}>
            {(virtualItem, item) => {
                const isSelected = layoutMusics.selectedIndices.includes(virtualItem.index) && selectable;
                const ItemComponent = isSelected ? SelectedItem : Item;

                return (
                    <ItemComponent
                        selected={isSelected}
                        odd={virtualItem.index % 2 !== 0}
                        active={item.id === playingMusic?.id}
                        onClick={e => handleItemClick(virtualItem.index, e.shiftKey)}
                    >
                        <Cell withoutPadding>
                            <AlbumArt
                                style={{ backgroundImage: `url(cruise://${item.albumArts[0].path})` }}
                                onClick={() => handlePlay(virtualItem.index)}
                            >
                                <PlayArrowRoundedIcon />
                            </AlbumArt>
                        </Cell>
                        <Cell grow withoutPadding>
                            <Label>{`${withTrackNumber ? `${item.track}. ` : ""}${item.title}`}</Label>
                        </Cell>
                        <Cell width="20%">{renderArtist(item)}</Cell>
                        <Cell width="25%">
                            <Box minWidth={0} pr={1}>
                                {item.album && (
                                    <LinkLabel to={`/albums/${item.album.id}`}>
                                        <span>{item.album.title}</span>
                                    </LinkLabel>
                                )}
                            </Box>
                        </Cell>
                    </ItemComponent>
                );
            }}
        </VirtualizedList>
    );
}
