import React from "react";

import { Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { usePlayer } from "@components/Player/Provider";
import { VirtualizedList } from "@components/VirtualizedList";
import { AlbumArt, Cell, Item } from "@components/MusicList.styles";

import { MinimalMusicFragment } from "@queries";

export interface MusicListProps {
    items: MinimalMusicFragment[];
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
                        <Typography variant="body1" fontSize="0.9rem">
                            {item.title}
                        </Typography>
                    </Cell>
                    <Cell width="20%">
                        <Typography variant="body1" fontSize="0.9rem">
                            {item.albumArtist}
                        </Typography>
                    </Cell>
                    <Cell width="25%">
                        <Typography variant="body1" fontSize="0.9rem">
                            {item.album?.title}
                        </Typography>
                    </Cell>
                </Item>
            )}
        </VirtualizedList>
    );
}
