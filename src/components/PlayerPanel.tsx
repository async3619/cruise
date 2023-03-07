import React from "react";

import { Box, Typography } from "@mui/material";

import withPlayer, { WithPlayerProps } from "@player/withPlayer";

import Placeholder from "@components/Placeholder";
import PlayerControl from "@components/PlayerControl";
import PlayerOptions from "@components/PlayerOptions";
import Slider from "@components/UI/Slider";

import { Content, PlayTime, ProgressWrapper, Root } from "@components/PlayerPanel.styles";

import formatDuration from "@utils/formatDuration";

export interface PlayerPanelProps extends WithPlayerProps {}
export interface PlayerPanelStates {
    currentTime: number;
    duration: number;

    sliderDragging: boolean;
    sliderValue: number;
}

class PlayerPanel extends React.Component<PlayerPanelProps, PlayerPanelStates> {
    public state: PlayerPanelStates = {
        currentTime: 0,
        duration: 0,

        sliderDragging: false,
        sliderValue: 0,
    };

    public componentDidMount() {
        this.props.addEventListener("load", this.handlePlay);
        this.props.addEventListener("progress", this.handleProgress);
    }
    public componentWillUnmount() {
        this.props.removeEventListener("load", this.handlePlay);
        this.props.removeEventListener("progress", this.handleProgress);
    }

    private handlePlay = (currentTime: number, duration: number) => {
        this.setState({ duration });
    };
    private handleProgress = (currentTime: number, duration: number) => {
        this.setState({ currentTime, duration });
    };

    private handleChange = (_: any, value: number | number[]) => {
        if (Array.isArray(value)) {
            return;
        }

        this.setState({
            sliderDragging: true,
            sliderValue: value,
            currentTime: value,
        });
    };
    private handleChangeCommitted = (_: any, value: number | number[]) => {
        if (Array.isArray(value)) {
            return;
        }

        this.setState({
            sliderDragging: false,
        });

        this.props.seekTo(value);
    };

    public render() {
        const { currentTime, duration, sliderDragging, sliderValue } = this.state;

        return (
            <Root>
                <ProgressWrapper>
                    <PlayTime>
                        <Typography variant="body1" fontSize="0.85rem">
                            <span>{formatDuration(currentTime)}</span>
                        </Typography>
                    </PlayTime>
                    <Slider
                        min={0}
                        max={duration || 0}
                        value={sliderDragging ? sliderValue : currentTime}
                        onChange={this.handleChange}
                        onChangeCommitted={this.handleChangeCommitted}
                    />
                    <PlayTime>
                        <Typography variant="body1" fontSize="0.85rem">
                            <span>{formatDuration(duration)}</span>
                        </Typography>
                    </PlayTime>
                </ProgressWrapper>
                <Content>
                    <Placeholder />
                    <Box>
                        <PlayerControl />
                    </Box>
                    <Placeholder />
                    <PlayerOptions />
                </Content>
            </Root>
        );
    }
}

export default withPlayer(PlayerPanel);
