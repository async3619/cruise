import React from "react";

import { Box, IconButton, Tooltip } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

import usePlayer from "@player/usePlayer";

import { Root } from "@components/PlayerControl.styles";

export default function PlayerControl() {
    const player = usePlayer();
    const PlayButtonIcon = player.isPlaying ? PauseRoundedIcon : PlayArrowRoundedIcon;

    const handlePlayPauseClick = () => {
        if (player.isPlaying) {
            player.pause();
        } else {
            player.play();
        }
    };

    return (
        <Root>
            <Tooltip title="Previous">
                <IconButton onClick={player.previous}>
                    <SkipPreviousRoundedIcon />
                </IconButton>
            </Tooltip>
            <Box mx={1}>
                <Tooltip title={player.isPlaying ? "Pause" : "Play"}>
                    <IconButton size="large" onClick={handlePlayPauseClick}>
                        <PlayButtonIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Tooltip title="Next">
                <IconButton onClick={player.next}>
                    <SkipNextRoundedIcon />
                </IconButton>
            </Tooltip>
        </Root>
    );
}
