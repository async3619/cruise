import React from "react";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { usePlayer } from "@components/Player/Provider";
import { VirtualizedList } from "@components/VirtualizedList";
import { AlbumArt, Cell, Item, Label, LinkLabel } from "@components/MusicList.styles";

import { MinimalMusicFragment } from "@queries";
import { Box } from "@mui/material";

export interface MusicListProps {
    items: ReadonlyArray<MinimalMusicFragment>;
}

export function MusicList({ items }: MusicListProps) {
    const { playPlaylist, playingMusic } = usePlayer();

    const handlePlay = (index: number) => {
        playPlaylist(items, index);
    };

    return (
        <VirtualizedList rowHeight={52} items={items}>
            {(virtualItem, item) => (
                <Item odd={virtualItem.index % 2 !== 0} active={item.id === playingMusic?.id}>
                    <Cell>
                        <AlbumArt
                            style={{ backgroundImage: `url(cruise://${item.albumArts[0].path})` }}
                            onClick={() => handlePlay(virtualItem.index)}
                        >
                            <PlayArrowRoundedIcon />
                        </AlbumArt>
                    </Cell>
                    <Cell grow>
                        <Label>{item.title}</Label>
                    </Cell>
                    <Cell width="20%">
                        <Box minWidth={0} pr={1}>
                            <LinkLabel>
                                <span>{item.albumArtist}</span>
                            </LinkLabel>
                        </Box>
                    </Cell>
                    <Cell width="25%">
                        <Box minWidth={0} pr={1}>
                            <LinkLabel>
                                <span>{item.album?.title}</span>
                            </LinkLabel>
                        </Box>
                    </Cell>
                </Item>
            )}
        </VirtualizedList>
    );
}
