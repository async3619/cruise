import React from "react";

import { Slider } from "ui";

import { IconButton } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

import { Control, Root } from "@components/VolumeControl.styles";
import { usePlayer } from "@components/Player/context";

export function VolumeControl() {
    const player = usePlayer();
    const [muted, setMuted] = React.useState(player.muted);
    const [volume, setVolume] = React.useState(player.volume);

    React.useEffect(() => {
        setVolume(player.volume);
    }, [player.volume]);

    const handleChange = React.useCallback(
        (value: number) => {
            player.setVolume(value);
            setVolume(value);

            if (value === 0) {
                setMuted(true);
            } else if (muted) {
                setMuted(false);
            }
        },
        [player, muted],
    );
    const handleChangeEnd = React.useCallback(
        (value: number) => {
            player.setVolume(value, true);
            setVolume(value);

            if (value === 0) {
                setMuted(true);
            } else if (muted) {
                setMuted(false);
            }
        },
        [player, muted],
    );

    const handleClick = React.useCallback(() => {
        const isMuted = player.muted;

        player.setMuted(!isMuted);
        setMuted(!isMuted);
        setVolume(isMuted ? player.volume : 0);
    }, [player]);

    return (
        <Root>
            <Control>
                <Slider
                    value={muted ? 0 : volume}
                    min={0}
                    max={1}
                    onValueChange={handleChange}
                    onValueChangeEnd={handleChangeEnd}
                />
            </Control>
            <IconButton size="small" onClick={handleClick}>
                {!muted && <VolumeUpRoundedIcon fontSize="small" />}
                {muted && <VolumeOffIcon fontSize="small" />}
            </IconButton>
        </Root>
    );
}
