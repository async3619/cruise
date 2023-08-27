import React from "react";

import { Typography } from "@mui/material";

import { PlayerControl } from "@components/Player/Control";
import { usePlayer } from "@components/Player/context";

import { AlbumArtView, Description, NowPlaying, Root, Section } from "@components/Player/Panel.styles";

export interface PlayerPanelProps {}

export function PlayerPanel({}: PlayerPanelProps) {
    const player = usePlayer();
    const currentMusic = player.getCurrentMusic();

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
                                {currentMusic.artists[0].name} · {currentMusic.album?.title || "Unknown Album"}
                            </Typography>
                        </Description>
                    </NowPlaying>
                )}
            </Section>
            <PlayerControl />
            <Section></Section>
        </Root>
    );
}
