import React from "react";

import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";

import { Root } from "@components/Player/Options.styles";
import { ButtonWrapper } from "@components/Player/Control.styles";

import usePlayer from "@player/usePlayer";
import { RepeatMode } from "@player/context";

import { REPEAT_MODE_ICONS, REPEAT_MODE_NAMES } from "@constants/player";
import VolumePopover from "@components/VolumePopover";

export default function PlayerOptions() {
    const { shuffle, repeatMode, toggleRepeatMode } = usePlayer();
    const theme = useTheme();
    const shuffleIconRef = React.useRef<SVGSVGElement>(null);
    const RepeatIcon = REPEAT_MODE_ICONS[repeatMode];

    const handleShuffleClick = () => {
        if (!shuffleIconRef.current) {
            return;
        }

        shuffleIconRef.current.animate(
            {
                transform: ["rotateX(0deg)", "rotateX(360deg)"],
            },
            {
                duration: 750,
                easing: theme.transitions.easing.easeInOut,
            },
        );

        shuffle();
    };

    return (
        <Root>
            <PopupState variant="popover" popupId="demo-popup-popover">
                {popupState => (
                    <ButtonWrapper disabled>
                        <Tooltip title="Volume">
                            <IconButton {...bindTrigger(popupState)}>
                                <VolumeUpRoundedIcon />
                            </IconButton>
                        </Tooltip>
                        <VolumePopover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                        />
                    </ButtonWrapper>
                )}
            </PopupState>
            <ButtonWrapper disabled={repeatMode === RepeatMode.None}>
                <Tooltip title={REPEAT_MODE_NAMES[repeatMode]}>
                    <IconButton onClick={toggleRepeatMode}>
                        <RepeatIcon />
                    </IconButton>
                </Tooltip>
            </ButtonWrapper>
            <ButtonWrapper disabled>
                <Tooltip title="Shuffle">
                    <IconButton onClick={handleShuffleClick}>
                        <ShuffleRoundedIcon ref={shuffleIconRef} />
                    </IconButton>
                </Tooltip>
            </ButtonWrapper>
        </Root>
    );
}
