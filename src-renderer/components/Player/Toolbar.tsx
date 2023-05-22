import React from "react";

import { Box, IconButton, Typography, useTheme } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import RepeatOneRoundedIcon from "@mui/icons-material/RepeatOneRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { usePlayer } from "@components/Player/Provider";
import { RepeatMode } from "@components/Player/types";

import { Slider } from "@components/ui/Slider";

import { AlbumArt, Controls, Information, NowPlaying, Root } from "@components/Player/Toolbar.styles";
import { formatSeconds } from "@utils/formatTime";

export interface PlayerToolbarProps {}

export function PlayerToolbar({}: PlayerToolbarProps) {
    const [time, setTime] = React.useState(0);
    const theme = useTheme();
    const player = usePlayer();
    const shuffleIconRef = React.useRef<SVGSVGElement>(null);
    const handlePlayPause = () => {
        if (player.playing) {
            player.pause();
        } else {
            player.play();
        }
    };
    const handleShuffle = () => {
        if (!shuffleIconRef.current) {
            return;
        }

        shuffleIconRef.current.animate(
            [
                { transform: "rotateX(0)" },
                { transform: "rotateX(180deg)", color: theme.palette.primary.main },
                { transform: "rotateX(360deg)" },
            ],
            {
                duration: theme.transitions.duration.complex,
                iterations: 1,
            },
        );

        player.shuffle();
    };

    React.useEffect(() => {
        const handleTimeUpdate = (time: number) => {
            setTime(time);
        };

        player.addEventListener("timeUpdate", handleTimeUpdate);

        return () => {
            player.removeEventListener("timeUpdate", handleTimeUpdate);
        };
    }, [player]);

    let repeatIcon = <RepeatRoundedIcon fontSize="small" />;
    if (player.repeatMode === RepeatMode.One) {
        repeatIcon = <RepeatOneRoundedIcon fontSize="small" />;
    }

    let isRepeatDisabled = false;
    if (player.repeatMode === RepeatMode.None) {
        isRepeatDisabled = true;
    }

    const duration = player.playingMusic?.duration ?? 0;
    const music = player.playingMusic;

    return (
        <Root>
            <NowPlaying>
                {player.playingMusic && (
                    <>
                        <AlbumArt
                            style={{
                                backgroundImage: `url(cruise://${player.playingMusic.albumArts[0].path})`,
                            }}
                        />
                        <Information>
                            <Typography variant="body1" fontSize="0.9rem" lineHeight={1} sx={{ mb: 0.5 }}>
                                {player.playingMusic.title}
                            </Typography>
                            <Typography variant="body2" fontSize="0.8rem" color="text.secondary" lineHeight={1}>
                                {player.playingMusic.albumArtist}
                            </Typography>
                        </Information>
                    </>
                )}
            </NowPlaying>
            <Box pb={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Controls>
                    <IconButton
                        size="small"
                        disabled={!player.playlist}
                        onClick={handleShuffle}
                        sx={{ color: "text.disabled" }}
                    >
                        <ShuffleRoundedIcon ref={shuffleIconRef} fontSize="small" />
                    </IconButton>
                    <IconButton size="small" disabled={!player.canSeekBackward} onClick={player.seekBackward}>
                        <FastRewindRounded />
                    </IconButton>
                    <IconButton size="small" disabled={!player.playingMusic} onClick={handlePlayPause}>
                        {!player.playing && <PlayArrowRoundedIcon fontSize="large" />}
                        {player.playing && <PauseRoundedIcon fontSize="large" />}
                    </IconButton>
                    <IconButton size="small" disabled={!player.canSeekForward} onClick={player.seekForward}>
                        <FastForwardRounded />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={player.toggleRepeatMode}
                        sx={{ color: isRepeatDisabled ? "text.disabled" : "primary.main" }}
                    >
                        {repeatIcon}
                    </IconButton>
                </Controls>
                <Box width={400} display="flex" alignItems="center">
                    <Typography
                        variant="body1"
                        fontSize="0.8rem"
                        lineHeight={1}
                        color="text.disabled"
                        fontFamily="monpspace"
                    >
                        {formatSeconds(time)}
                    </Typography>
                    <Box flex="1 1 auto" mx={2}>
                        <Slider value={time} min={0} max={duration} disabled={!music} onValueChangeEnd={player.seek} />
                    </Box>
                    <Typography
                        variant="body1"
                        fontSize="0.8rem"
                        lineHeight={1}
                        color="text.disabled"
                        fontFamily="monpspace"
                    >
                        {formatSeconds(duration)}
                    </Typography>
                </Box>
            </Box>
            <Box flex="1 1 auto" />
        </Root>
    );
}
