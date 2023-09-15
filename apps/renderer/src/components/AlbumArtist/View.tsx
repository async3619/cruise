import React from "react";

import { Fab, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { Image, Metadata, PlayButton, Root } from "@components/AlbumArtist/View.styles";

import { MinimalAlbum } from "@utils/types";

export interface AlbumArtistViewProps {
    item: MinimalAlbum;
    onPlay(album: MinimalAlbum): void;
}

export function AlbumArtistView({ item, onPlay }: AlbumArtistViewProps) {
    const imageUrl = item.albumArt?.url;

    const handleClick = React.useCallback(() => {}, []);
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

    return (
        <Root tabIndex={0} role="button" data-testid="AlbumArtistView" onKeyDown={handleKeyDown} onClick={handleClick}>
            <Image style={{ backgroundImage: `url(${imageUrl})` }}>
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
