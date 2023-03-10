import React from "react";

import { Box, Typography } from "@mui/material";
import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import Placeholder from "@components/Placeholder";

import { AlbumArt, AlbumArtWrapper, Button, Controls, Root } from "@components/UI/AlbumList/Item.styles";

import { AlbumListItem as AlbumListItemType, ArtistAlbumListItem } from "@utils/types";

export interface AlbumListItemProps {
    subtitleType?: "artist" | "year";
    item: AlbumListItemType | ArtistAlbumListItem;
    onPlay(item: AlbumListItemType): void;
    onClick(item: AlbumListItemType): void;
}

export default function AlbumListItem(props: AlbumListItemProps) {
    const { item, onPlay, onClick, subtitleType = "artist" } = props;
    const albumArt = item.musics[0]?.albumArts[0];

    const handlePlayButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onPlay(item);

        e.stopPropagation();
        e.preventDefault();
    };

    const handleClick = () => {
        onClick(item);
    };

    let subtitle: React.ReactNode;
    if (subtitleType === "artist") {
        subtitle = item.artists.map(artist => artist.name).join(", ");
    } else {
        if ("year" in item && item.year) {
            subtitle = item.year.toString();
        } else {
            subtitle = "Unknown Year";
        }
    }

    return (
        <Root onClick={handleClick}>
            <AlbumArtWrapper empty={!albumArt}>
                {albumArt && <AlbumArt src={`cruise://${albumArt.path}`} alt={item.title} />}
                {!albumArt && <ImageNotSupportedRoundedIcon />}
                <Controls>
                    <Placeholder />
                    <Button onClick={handlePlayButtonClick}>
                        <PlayArrowRoundedIcon />
                    </Button>
                </Controls>
            </AlbumArtWrapper>
            <Box mt={0.75} px={0.5}>
                <Typography variant="body1" fontWeight={800}>
                    {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {subtitle}
                </Typography>
            </Box>
        </Root>
    );
}
