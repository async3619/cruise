import React from "react";
import { useTranslation } from "react-i18next";

import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import RepeatOneRoundedIcon from "@mui/icons-material/RepeatOneRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";

import { PlayerControl } from "@components/Player/Control";
import { usePlayer } from "@components/Player/context";
import { RepeatMode } from "@components/Player/Provider";

import { AlbumArtView, Description, NowPlaying, Root, Section } from "@components/Player/Panel.styles";

export interface PlayerPanelProps {}

export function PlayerPanel({}: PlayerPanelProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const player = usePlayer();
    const currentMusic = player.getCurrentMusic();
    const repeatMode = player.repeatMode;
    const [shuffleAnimating, setShuffleAnimating] = React.useState(false);

    const handleShuffleClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!shuffleAnimating) {
                e.currentTarget
                    .animate(
                        [
                            { transform: "rotateX(0)" },
                            { transform: "rotateX(180deg)" },
                            { transform: "rotateX(360deg)" },
                        ],
                        { duration: theme.transitions.duration.complex, iterations: 1 },
                    )
                    .addEventListener("finish", () => {
                        setShuffleAnimating(false);
                    });

                setShuffleAnimating(true);
            }

            player.shufflePlaylist();
        },
        [theme, player, shuffleAnimating],
    );

    const handleRepeatClick = React.useCallback(() => {
        if (repeatMode === RepeatMode.None) {
            player.setRepeatMode(RepeatMode.All);
        } else if (repeatMode === RepeatMode.All) {
            player.setRepeatMode(RepeatMode.One);
        } else if (repeatMode === RepeatMode.One) {
            player.setRepeatMode(RepeatMode.None);
        }
    }, [player, repeatMode]);

    let repeatModeIcon = <RepeatRoundedIcon fontSize="small" color="disabled" />;
    if (repeatMode === RepeatMode.One) {
        repeatModeIcon = <RepeatOneRoundedIcon fontSize="small" />;
    } else if (repeatMode === RepeatMode.All) {
        repeatModeIcon = <RepeatRoundedIcon fontSize="small" />;
    }

    return (
        <Root data-testid="PlayerPanel">
            <Section>
                {currentMusic && (
                    <NowPlaying>
                        <AlbumArtView albumArt={currentMusic.albumArt} />
                        <Description>
                            <Typography
                                variant="body1"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                sx={{ mb: 0.25 }}
                            >
                                {currentMusic.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                            >
                                {currentMusic.artists[0].name} ·{" "}
                                {currentMusic.album?.title || t("common.unknown-album")}
                            </Typography>
                        </Description>
                    </NowPlaying>
                )}
            </Section>
            <PlayerControl />
            <Section>
                <Box width="100%" display="flex" justifyContent="flex-end" alignItems="center" pr={1}>
                    <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={handleRepeatClick}>
                            {repeatModeIcon}
                        </IconButton>
                        <IconButton size="small" onClick={handleShuffleClick}>
                            <ShuffleRoundedIcon fontSize="small" color={shuffleAnimating ? "inherit" : "disabled"} />
                        </IconButton>
                    </Stack>
                </Box>
            </Section>
        </Root>
    );
}
