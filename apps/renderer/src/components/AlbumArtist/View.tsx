import React from "react";
import { useNavigate } from "react-router-dom";

import { Fab, Typography, Checkbox } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";

import { CheckBoxWrapper, ImageIcon, Image, Metadata, PlayButton, Root } from "@components/AlbumArtist/View.styles";

import { FullArtist, MinimalAlbum } from "@utils/types";
import { stopPropagation } from "@utils/events";

export interface AlbumArtistViewProps {
    item: MinimalAlbum | FullArtist;
    selected?: boolean;
    onPlay(item: MinimalAlbum | FullArtist): void;
    onSelectChange?(item: MinimalAlbum | FullArtist, selected: boolean): void;
}

export function AlbumArtistView({ item, onPlay, onSelectChange, selected }: AlbumArtistViewProps) {
    const navigate = useNavigate();
    const isArtist = item.__typename === "Artist";

    const handleClick = React.useCallback(() => {
        const itemType = isArtist ? "artist" : "album";

        navigate(`/library/${itemType}/${item.id}`);
    }, [item, navigate, isArtist]);
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!(e.key === "Enter" || e.key === " ")) {
                return;
            }

            e.preventDefault();
            handleClick();
        },
        [handleClick],
    );

    const handlePlayClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();

            onPlay(item);
        },
        [onPlay, item],
    );

    const handleCheckboxChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            stopPropagation(e);

            onSelectChange?.(item, checked);
        },
        [item, onSelectChange],
    );

    let title: string;
    let subtitle: string | undefined;
    let imageUrl: string | undefined;
    if (item.__typename === "Album") {
        title = item.title;
        subtitle = item.albumArtists.join(", ");
        imageUrl = item.albumArt?.url;
    } else if (item.__typename === "Artist") {
        title = item.name;
    } else {
        throw new Error("Invalid item type");
    }

    return (
        <Root tabIndex={0} role="button" data-testid="AlbumArtistView" onKeyDown={handleKeyDown} onClick={handleClick}>
            <Image circular={isArtist} style={{ backgroundImage: `url(${imageUrl})` }}>
                {!imageUrl && (
                    <ImageIcon>
                        {isArtist && <PersonRoundedIcon />}
                        {!isArtist && <AlbumRoundedIcon />}
                    </ImageIcon>
                )}
                {onSelectChange && (
                    <CheckBoxWrapper visible={selected || false}>
                        <Checkbox
                            size="small"
                            checked={selected}
                            onChange={handleCheckboxChange}
                            onKeyDown={stopPropagation}
                            onMouseDown={stopPropagation}
                            onClick={stopPropagation}
                        />
                    </CheckBoxWrapper>
                )}
                <PlayButton>
                    <Fab color="primary" aria-label="add" size="small" onClick={handlePlayClick}>
                        <PlayArrowRoundedIcon />
                    </Fab>
                </PlayButton>
            </Image>
            <Metadata>
                <Typography variant="body1" fontSize="1rem">
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" fontSize="0.9rem" color="text.disabled" sx={{ mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </Metadata>
        </Root>
    );
}
