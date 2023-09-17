import React from "react";
import { useNavigate } from "react-router-dom";

import { Fab, Typography, Checkbox } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { CheckBoxWrapper, Image, Metadata, PlayButton, Root } from "@components/AlbumArtist/View.styles";

import { MinimalAlbum } from "@utils/types";
import { stopPropagation } from "@utils/events";

export interface AlbumArtistViewProps {
    item: MinimalAlbum;
    selected?: boolean;
    onPlay(album: MinimalAlbum): void;
    onSelectChange?(album: MinimalAlbum, selected: boolean): void;
}

export function AlbumArtistView({ item, onPlay, onSelectChange, selected }: AlbumArtistViewProps) {
    const imageUrl = item.albumArt?.url;
    const navigate = useNavigate();

    const handleClick = React.useCallback(() => {
        navigate(`/library/album/${item.id}`);
    }, [item, navigate]);
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

    return (
        <Root tabIndex={0} role="button" data-testid="AlbumArtistView" onKeyDown={handleKeyDown} onClick={handleClick}>
            <Image style={{ backgroundImage: `url(${imageUrl})` }}>
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
                <Typography variant="body1" fontSize="1rem" sx={{ mb: 0.5 }}>
                    {item.title}
                </Typography>
                <Typography variant="body2" fontSize="0.9rem" color="text.disabled">
                    {item.albumArtists.join(", ")}
                </Typography>
            </Metadata>
        </Root>
    );
}
