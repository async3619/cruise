import React from "react";

import { Box, Typography } from "@mui/material";
import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";

import { AlbumArtType } from "@queries";

import { AlbumArt, MetaData, Root, Separator } from "@components/Player/MusicView.styles";

import { PlayableMusic } from "@utils/types";
import { PlayerContextValue } from "@player/context";

export interface PlayerMusicViewProps {
    player: PlayerContextValue;
}

export default class PlayerMusicView extends React.Component<PlayerMusicViewProps> {
    private renderPlaceholder() {
        return (
            <Root disabled>
                <AlbumArt>
                    <ImageNotSupportedRoundedIcon />
                </AlbumArt>
            </Root>
        );
    }

    public render() {
        const { player } = this.props;
        const { currentMusic } = player;
        if (!currentMusic) {
            return this.renderPlaceholder();
        }

        const albumArt: PlayableMusic["albumArts"][0] | undefined =
            currentMusic.albumArts.find(a => a.type === AlbumArtType.CoverFront) || currentMusic.albumArts[0];

        return (
            <Root>
                <AlbumArt>
                    {albumArt && <img src={`cruise://${albumArt.path}`} alt={currentMusic.title} />}
                    {!albumArt && <ImageNotSupportedRoundedIcon />}
                </AlbumArt>
                <MetaData>
                    <Typography variant="body1" fontSize="1.25rem" fontWeight={600}>
                        {currentMusic.title}
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" color="text.secondary">
                            {currentMusic.album?.artists?.[0]?.name || "Unknown Artist"}
                        </Typography>
                        <Separator />
                        <Typography variant="body1" color="text.secondary">
                            {currentMusic.album?.title || "Unknown Album"}
                        </Typography>
                    </Box>
                </MetaData>
            </Root>
        );
    }
}
