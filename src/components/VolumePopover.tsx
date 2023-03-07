import React from "react";

import { Box, IconButton, Popover, PopoverProps, Tooltip, Typography } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";

import { Root } from "@components/VolumePopover.styles";
import Slider from "@components/UI/Slider";

import usePlayer from "@player/usePlayer";

export interface VolumePopoverProps extends PopoverProps {}

export default function VolumePopover(props: VolumePopoverProps) {
    const { volume, setVolume } = usePlayer();
    const [lastVolume, setLastVolume] = React.useState<number | null>(null);
    const [currentVolume, setCurrentVolume] = React.useState<number>(volume * 100);

    const handleChange = (_: any, value: number | number[]) => {
        if (Array.isArray(value)) {
            return;
        }

        setCurrentVolume(value);
        setVolume(value / 100);
    };

    const handleMuteClick = () => {
        if (currentVolume > 0) {
            setCurrentVolume(0);
            setVolume(0);
            setLastVolume(currentVolume);
        } else {
            const targetVolume = lastVolume || 100;

            setCurrentVolume(targetVolume);
            setVolume(targetVolume / 100);
            setLastVolume(null);
        }
    };

    const handleWheel = (event: React.WheelEvent) => {
        const delta = (event.deltaY > 0 ? -1 : 1) * 2;
        const targetVolume = Math.min(Math.max(currentVolume + delta, 0), 100);

        handleChange(null, targetVolume);
    };

    React.useEffect(() => {
        setCurrentVolume(Math.floor(volume * 100));
    }, [volume]);

    return (
        <Popover PaperProps={{ elevation: 4 }} {...props}>
            <Root>
                <Tooltip title={currentVolume === 0 ? "Restore" : "Mute"}>
                    <IconButton onClick={handleMuteClick}>
                        {currentVolume === 0 ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}
                    </IconButton>
                </Tooltip>
                <Box mx={2} width="150px">
                    <Slider min={0} max={100} value={currentVolume} onChange={handleChange} onWheel={handleWheel} />
                </Box>
                <Typography variant="body2" textAlign="right" sx={{ width: "38px" }}>
                    {currentVolume}%
                </Typography>
            </Root>
        </Popover>
    );
}
