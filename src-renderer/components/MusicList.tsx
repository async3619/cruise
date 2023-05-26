import React from "react";

import { Box } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { usePlayer } from "@components/Player/Provider";
import { VirtualizedList } from "@components/VirtualizedList";
import { AlbumArt, Cell, Item, Label, LinkLabel } from "@components/MusicList.styles";

import { ArtistIdNameFragment, MinimalMusicFragment } from "@queries";

export interface MusicListProps {
    items: ReadonlyArray<MinimalMusicFragment>;
    withTrackNumber?: boolean;
}

export function MusicList({ items, withTrackNumber }: MusicListProps) {
    const { playPlaylist, playingMusic } = usePlayer();

    const handlePlay = (index: number) => {
        playPlaylist(items, index);
    };

    const renderArtist = (music: MinimalMusicFragment) => {
        const artists: Array<ArtistIdNameFragment> | string =
            music.album?.leadArtists || music.artists || music.albumArtist;

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
                </Item>
            )}
        </VirtualizedList>
    );
}
