import React from "react";

import { Box, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { Image, PlayButton, Root, Subtitle, Title, Wrapper } from "@components/Card.styles";

import { AlbumArtType, MinimalAlbumFragment } from "@queries";

export interface CardProps {
    item: MinimalAlbumFragment;
    onPlay?(item: MinimalAlbumFragment): void;
    href?: string;
}

export function Card({ item, onPlay, href }: CardProps) {
    const coverItem = item.albumArts.find(item => item.type === AlbumArtType.CoverFront) || item.albumArts[0];

    const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onPlay?.(item);
        e.stopPropagation();
        e.preventDefault();
    };

    const content = (
        <Root component={href ? "span" : "div"} disableRipple>
            <Box position="relative" mb={3}>
                <Image type="square" src={coverItem?.url} />
                {onPlay && (
                    <PlayButton tabIndex={-1} size="small" color="primary" aria-label="Play" onClick={handlePlayClick}>
                        <PlayArrowRoundedIcon />
                    </PlayButton>
                )}
            </Box>
            <Typography component={Title} variant="body1" fontSize="0.9rem" fontWeight={800}>
                {item.title}
            </Typography>
            <Typography component={Subtitle} variant="body1" fontSize="0.9rem" color="text.disabled">
                {item.leadArtists.map(item => item.name).join(", ")}
            </Typography>
        </Root>
    );

    if (href) {
        return <Wrapper to={href}>{content}</Wrapper>;
    }

    return content;
}
