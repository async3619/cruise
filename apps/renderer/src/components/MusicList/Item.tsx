import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

import { AlbumArt } from "@components/AlbumArt";
import { DisabledText } from "@styles/components";
import { useMusicSelection } from "@components/Selection";
import { usePlayer } from "@components/Player/context";

import { formatDuration } from "@utils/duration";
import { MinimalMusic } from "@utils/types";

import { AlbumInformation, Column, Label, PlayPauseButton, Item as Root } from "@components/MusicList/index.styles";

export interface ItemProps {
    item: MinimalMusic;
    musics: MinimalMusic[];
    index: number;
    withAlbum?: boolean;

    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
    onPlayPauseClick: (e: React.MouseEvent<HTMLButtonElement>, index: number) => void;
}

export function Item({ item, index, onClick, onKeyDown, onPlayPauseClick, musics, withAlbum = false }: ItemProps) {
    const selection = useMusicSelection();
    const player = usePlayer();
    const currentMusic = player.getCurrentMusic();
    const { t } = useTranslation();
    const isActive = currentMusic?.id === item.id;

    const handleItemClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            onClick(e, index);
        },
        [index, onClick],
    );

    const handleItemKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            onKeyDown(e, index);
        },
        [index, onKeyDown],
    );

    const handlePlayPauseClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            onPlayPauseClick(e, index);
        },
        [index, onPlayPauseClick],
    );

    return (
        <Root
            tabIndex={0}
            odd={index % 2 !== 0}
            key={item.id}
            isActive={isActive}
            onClick={handleItemClick}
            onKeyDown={handleItemKeyDown}
            selected={selection?.selectedIndices.includes(index) || false}
        >
            {withAlbum && (!index || item.album?.id !== musics[index - 1].album?.id) && (
                <AlbumInformation>
                    <AlbumArt albumArt={item.albumArt} />
                    <Box mt={1}>
                        <Typography
                            variant="body1"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            color="text.primary"
                        >
                            {item.album?.title || t("common.unknown-album")}
                        </Typography>
                        {item.year && (
                            <Typography component={DisabledText} variant="body2">
                                {item.year}
                            </Typography>
                        )}
                    </Box>
                </AlbumInformation>
            )}
            <Column columnWidth="44px">
                <PlayPauseButton withoutBorder albumArt={item.albumArt} onClick={handlePlayPauseClick}>
                    {(!isActive || !player.isPlaying) && <PlayArrowRoundedIcon />}
                    {isActive && player.isPlaying && <PauseRoundedIcon />}
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
                    {item.album?.title || t("common.unknown-album")}
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
        </Root>
    );
}
