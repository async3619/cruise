import React from "react";

import { Box, Checkbox, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { CheckboxWrapper, Image, PlayButton, Root, Subtitle, Title, Wrapper } from "@components/Card.styles";

import { AlbumArtType, MinimalAlbumArtFragment, MinimalAlbumFragment, MinimalArtistFragment } from "@queries";
import { Nullable } from "@common/types";

export interface BaseCardProps {
    href?: string;
    selected?: boolean;
    selectMode?: boolean;
    className?: string;
}

export interface ArtistCardProps extends BaseCardProps {
    item: MinimalArtistFragment;
    onPlay?(item: MinimalArtistFragment): void;
    onSelectionChange?(item: MinimalArtistFragment, selected: boolean): void;
}

export interface AlbumCardProps extends BaseCardProps {
    item: MinimalAlbumFragment;
    onPlay?(item: MinimalAlbumFragment): void;
    onSelectionChange?(item: MinimalAlbumFragment, selected: boolean): void;
}

export type CardProps = ArtistCardProps | AlbumCardProps;

export function Card({ item, onPlay, href, selected = false, onSelectionChange, selectMode, className }: CardProps) {
    let title: string;
    let subtitle: string | undefined;
    let image: Nullable<MinimalAlbumArtFragment>;
    let imageType: "square" | "circle";
    if (item.__typename === "Album") {
        image = item.albumArts.find(item => item.type === AlbumArtType.CoverFront) || item.albumArts[0];
        title = item.title;
        subtitle = item.leadArtists.map(item => item.name).join(", ");
        imageType = "square";
    } else if (item.__typename === "Artist") {
        image = item.portrait;
        title = item.name;
        imageType = "circle";
    } else {
        throw new Error(`Unknown item type: ${item.__typename}`);
    }

    const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onPlay?.(item as any);
        e.stopPropagation();
        e.preventDefault();
    };

    const handleCheckboxMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelectionChange?.(item as any, e.target.checked);
    };

    const handleWrapperClick = (e: React.MouseEvent) => {
        if (!selectMode) {
            return;
        }

        e.preventDefault();

        onSelectionChange?.(item as any, !selected);
    };

    const content = (
        <Root selected={selected} component={href ? "span" : "div"} disableRipple className={className}>
            <Box position="relative" mb={3}>
                <Image type={imageType} src={image?.url} />
                {item.__typename === "Album" && onSelectionChange && (
                    <CheckboxWrapper
                        onMouseDown={handleCheckboxMouseDown}
                        onClick={handleCheckboxMouseDown}
                        style={{ opacity: selected ? 1 : undefined }}
                    >
                        <Checkbox checked={selected} size="small" onChange={handleCheckboxChange} />
                    </CheckboxWrapper>
                )}
                {onPlay && (
                    <PlayButton
                        tabIndex={-1}
                        size="small"
                        color="primary"
                        aria-label="Play"
                        onClick={handlePlayClick}
                        style={{
                            opacity: selectMode ? 0 : undefined,
                            pointerEvents: selectMode ? "none" : undefined,
                        }}
                    >
                        <PlayArrowRoundedIcon />
                    </PlayButton>
                )}
            </Box>
            <Typography component={Title} variant="body1" fontSize="0.9rem" fontWeight={800}>
                {title}
            </Typography>
            {subtitle && (
                <Typography component={Subtitle} variant="body1" fontSize="0.9rem" color="text.disabled">
                    {subtitle}
                </Typography>
            )}
        </Root>
    );

    if (href) {
        return (
            <Wrapper to={href} onClick={handleWrapperClick}>
                {content}
            </Wrapper>
        );
    }

    return content;
}
