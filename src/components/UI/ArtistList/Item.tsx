import React from "react";

import { Box, Typography } from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { Button, Controls, Profile, Root } from "@components/UI/ArtistList/Item.styles";

import { ArtistListItem as ArtistListItemType } from "@utils/types";

export interface ArtistListItemProps {
    item: ArtistListItemType;
    onPlay(item: ArtistListItemType): void;
}

export default function ArtistListItem(props: ArtistListItemProps) {
    const { item, onPlay } = props;

    const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onPlay(item);

        e.stopPropagation();
        e.preventDefault();
    };

    return (
        <Root>
            <Profile empty>
                <PersonOutlineRoundedIcon />
                <Controls>
                    <Box flex="1 1 auto" />
                    <Button onClick={handlePlayClick}>
                        <PlayArrowRoundedIcon />
                    </Button>
                </Controls>
            </Profile>
            <Box mt={0.75} px={0.5}>
                <Typography variant="body1" fontWeight={800} textAlign="center" noWrap>
                    {item.name}
                </Typography>
            </Box>
        </Root>
    );
}
