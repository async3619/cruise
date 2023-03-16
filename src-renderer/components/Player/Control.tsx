import React from "react";

import { IconButton, Tooltip } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

import usePlayer from "@player/usePlayer";

import { ButtonWrapper, PlayWrapper, Root } from "@components/Player/Control.styles";

export default function PlayerControl() {
    const { play, pause, isPlaying, playlist, next, previous, hasNext, hasPrevious } = usePlayer();
    const PlayButtonIcon = isPlaying ? PauseRoundedIcon : PlayArrowRoundedIcon;
    const disabled = playlist.length <= 0;

    const handlePlayPauseClick = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    return (
        <Root>
            <ButtonWrapper>
                <Tooltip title="Previous">
                    <IconButton onClick={previous} disabled={disabled || !hasPrevious()}>
                        <SkipPreviousRoundedIcon />
                    </IconButton>
                </Tooltip>
            </ButtonWrapper>
            <PlayWrapper>
                <Tooltip title={isPlaying ? "Pause" : "Play"}>
                    <IconButton onClick={handlePlayPauseClick} disabled={disabled}>
                        <PlayButtonIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </PlayWrapper>
            <ButtonWrapper>
                <Tooltip title="Next">
                    <IconButton onClick={next} disabled={disabled || !hasNext()}>
                        <SkipNextRoundedIcon />
                    </IconButton>
                </Tooltip>
            </ButtonWrapper>
        </Root>
    );
}
