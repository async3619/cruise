import React from "react";

import { VirtualizedList } from "ui";

import { useLayout } from "@components/Layout/context";
import { usePlayer } from "@components/Player/context";
import { useMusicSelection } from "@components/Selection";
import { Item } from "@components/MusicList/Item";

import { Root, ShrinkList } from "@components/MusicList/index.styles";

import { MinimalMusic } from "@utils/types";

export interface MusicListProps {
    musics: MinimalMusic[];
    withAlbum?: boolean;
}

export function MusicList({ musics, withAlbum = false }: MusicListProps) {
    const { view } = useLayout();
    const player = usePlayer();
    const selection = useMusicSelection();

    const handlePlayPauseClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
            e.preventDefault();
            e.stopPropagation();

            const currentMusic = player.playlist[player.currentIndex];
            if (currentMusic && currentMusic.id === musics[index].id) {
                if (player.isPlaying) {
                    player.pause();
                } else {
                    player.play();
                }

                return;
            }

            player.playPlaylist(musics, index);
        },
        [player, musics],
    );

    const handleItemClick = React.useCallback(
        (_: React.MouseEvent<HTMLDivElement>, index: number) => {
            if (!selection) {
                return;
            }

            const newSelection = [...selection.selectedIndices];
            if (newSelection.includes(index)) {
                newSelection.splice(newSelection.indexOf(index), 1);
            } else {
                newSelection.push(index);
            }

            selection.setSelection(newSelection);
        },
        [selection],
    );
    const handleItemKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
            if (e.key === "Enter" || e.key === " ") {
                handleItemClick(e as any, index);
                e.preventDefault();
            }
        },
        [handleItemClick],
    );

    const List = (withAlbum ? ShrinkList : VirtualizedList) as typeof VirtualizedList<MinimalMusic>;

    return (
        <Root>
            <List items={musics} estimateSize={() => 56} scrollElement={view}>
                {(item, index) => (
                    <Item
                        item={item}
                        index={index}
                        key={item.id}
                        onClick={handleItemClick}
                        onKeyDown={handleItemKeyDown}
                        onPlayPauseClick={handlePlayPauseClick}
                        musics={musics}
                        withAlbum={withAlbum}
                    />
                )}
            </List>
        </Root>
    );
}
