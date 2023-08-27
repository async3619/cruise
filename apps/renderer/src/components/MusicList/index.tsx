import React from "react";
import { useTranslation } from "react-i18next";

import { VirtualizedList } from "ui";

import { Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

import { useLayout } from "@components/Layout/context";
import { usePlayer } from "@components/Player/context";
import { Column, Item, Label, PlayPauseButton, Root } from "@components/MusicList/index.styles";

import { MinimalMusic } from "@utils/types";
import { formatDuration } from "@utils/duration";

export interface MusicListProps {
    musics: MinimalMusic[];
}

export function MusicList({ musics }: MusicListProps) {
    const { t } = useTranslation();
    const { view } = useLayout();
    const player = usePlayer();

    const handlePlayPauseClick = React.useCallback(
        (index: number) => {
            if (player.currentIndex === index) {
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

    return (
        <Root>
            <VirtualizedList items={musics} estimateSize={() => 56} scrollElement={view}>
                {(item, index) => (
                    <Item odd={index % 2 !== 0} key={item.id} isActive={player.currentIndex === index}>
                        <Column columnWidth="44px">
                            <PlayPauseButton
                                withoutBorder
                                albumArt={item.albumArt}
                                onClick={() => handlePlayPauseClick(index)}
                            >
                                {(player.currentIndex !== index || !player.isPlaying) && <PlayArrowRoundedIcon />}
                                {player.currentIndex === index && player.isPlaying && <PauseRoundedIcon />}
                            </PlayPauseButton>
                        </Column>
                        <Column columnWidth="43%">
                            <Typography component={Label} variant="body1" fontSize="0.9rem">
                                {item.title}
                            </Typography>
                        </Column>
                        <Column columnWidth="18%">
                            <Typography component={Label} variant="body1" fontSize="0.9rem">
                                {item.artists[0].name}
                            </Typography>
                        </Column>
                        <Column columnWidth="18%">
                            <Typography component={Label} variant="body1" fontSize="0.9rem">
                                {item.album?.title || "Unknown"}
                            </Typography>
                        </Column>
                        <Column columnWidth="18%">
                            <Typography component={Label} variant="body1" fontSize="0.9rem">
                                {item.genre[0] || t("common.unknown-genre")}
                            </Typography>
                        </Column>
                        <Column columnWidth="7%">
                            <Typography component={Label} variant="body1" fontSize="0.9rem" textAlign="right">
                                {formatDuration(item.duration)}
                            </Typography>
                        </Column>
                    </Item>
                )}
            </VirtualizedList>
        </Root>
    );
}
