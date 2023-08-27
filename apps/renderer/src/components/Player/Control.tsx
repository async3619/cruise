import React from "react";
import { Slider } from "ui";

import { IconButton, Stack, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";

import { usePlayer } from "@components/Player/context";
import { Root, Time } from "@components/Player/Control.styles";
import { formatDuration } from "@utils/duration";

export interface PlayerControlProps {}

export function PlayerControl({}: PlayerControlProps) {
    const { isPlaying, pause, play, playlist, currentIndex, events, getCurrentMusic, seekTo, seekPlaylist } =
        usePlayer();
    const [currentTime, setCurrentTime] = React.useState(0);
    const isPlaylistEmpty = playlist.length === 0;
    const music = getCurrentMusic();

    React.useEffect(() => {
        const handleTimeUpdate = (currentTime: number) => {
            setCurrentTime(currentTime);
        };

        events.on("timeUpdate", handleTimeUpdate);

        return () => {
            events.off("timeUpdate", handleTimeUpdate);
        };
    }, [events]);

    const handlePrevious = React.useCallback(() => {
        seekPlaylist(currentIndex - 1);
    }, [currentIndex, seekPlaylist]);

    const handleNext = React.useCallback(() => {
        seekPlaylist(currentIndex + 1);
    }, [currentIndex, seekPlaylist]);

    return (
        <Root data-testid="PlayerControl">
            <Stack direction="row" spacing={1} alignItems="center">
                <IconButton disabled={isPlaylistEmpty || currentIndex === 0} onClick={handlePrevious}>
                    <SkipPreviousRoundedIcon />
                </IconButton>
                <IconButton disabled={isPlaylistEmpty} onClick={isPlaying ? pause : play}>
                    {!isPlaying && <PlayArrowRoundedIcon fontSize="large" />}
                    {isPlaying && <PauseRoundedIcon fontSize="large" />}
                </IconButton>
                <IconButton disabled={isPlaylistEmpty || currentIndex === playlist.length - 1} onClick={handleNext}>
                    <SkipNextRoundedIcon />
                </IconButton>
            </Stack>
            <Stack direction="row" width="100%" alignItems="center" spacing={1.5}>
                <Typography component={Time} fontSize="0.8rem" fontWeight={300}>
                    {formatDuration(currentTime)}
                </Typography>
                <Slider
                    value={currentTime}
                    min={0}
                    max={music?.duration ?? 0}
                    disabled={isPlaylistEmpty}
                    onValueChangeEnd={seekTo}
                />
                <Typography component={Time} fontSize="0.8rem" fontWeight={300}>
                    {formatDuration(music?.duration ?? 0)}
                </Typography>
            </Stack>
        </Root>
    );
}
