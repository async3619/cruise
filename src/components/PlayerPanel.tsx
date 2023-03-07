import React from "react";

import { Box, Typography } from "@mui/material";

import withPlayer, { WithPlayerProps } from "@player/withPlayer";

import { Content, Cursor, Filled, PlayTime, Progress, ProgressWrapper, Root } from "@components/PlayerPanel.styles";

import formatDuration from "@utils/formatDuration";
import Placeholder from "@components/Placeholder";
import PlayerControl from "@components/PlayerControl";
import PlayerOptions from "@components/PlayerOptions";

export interface PlayerPanelProps extends WithPlayerProps {}
export interface PlayerPanelStates {}

class PlayerPanel extends React.Component<PlayerPanelProps, PlayerPanelStates> {
    private readonly filledRef = React.createRef<HTMLDivElement>();
    private readonly cursorRef = React.createRef<HTMLDivElement>();
    private readonly currentTimeRef = React.createRef<HTMLSpanElement>();
    private readonly durationRef = React.createRef<HTMLSpanElement>();
    private readonly progressRef = React.createRef<HTMLDivElement>();

    private progressClientRect: DOMRect | null = null;
    private grabbedProgress = 0;
    private cursorGrabbed = false;
    private unmounted = false;

    public componentDidMount() {
        const interval = setInterval(() => {
            const audio = this.props.getAudio();
            if (!audio) {
                return;
            }

            window.requestAnimationFrame(this.frame);
            clearInterval(interval);
        }, 100);

        window.addEventListener("mousemove", this.handleCursorMouseMove);
        window.addEventListener("mouseup", this.handleCursorMouseUp);
    }
    public componentWillUnmount() {
        this.unmounted = true;

        window.removeEventListener("mousemove", this.handleCursorMouseMove);
        window.removeEventListener("mouseup", this.handleCursorMouseUp);
    }

    private frame = () => {
        if (this.unmounted) {
            return;
        }

        window.requestAnimationFrame(this.frame);

        const audio = this.props.getAudio();
        const filled = this.filledRef.current;
        const cursor = this.cursorRef.current;
        const currentTimeDOM = this.currentTimeRef.current;
        const durationDOM = this.durationRef.current;

        if (!audio || !filled || !cursor || !currentTimeDOM || !durationDOM) {
            return;
        }

        const { currentTime } = audio;
        const duration = audio.duration || 0;

        const progress = !duration ? 0 : currentTime / duration;

        if (!this.cursorGrabbed) {
            filled.style.transform = `scaleX(${progress})`;
            cursor.style.left = `${progress * 100}%`;

            currentTimeDOM.innerText = formatDuration(currentTime);
            durationDOM.innerText = formatDuration(duration - currentTime);
        } else {
            filled.style.transform = `scaleX(${this.grabbedProgress})`;
            cursor.style.left = `${this.grabbedProgress * 100}%`;

            const currentTime = duration * this.grabbedProgress;
            currentTimeDOM.innerText = formatDuration(currentTime);
            durationDOM.innerText = formatDuration(duration - currentTime);
        }
    };

    private handleProgressWrapperClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!this.progressRef.current) {
            return;
        }

        const audio = this.props.getAudio();
        if (!audio) {
            return;
        }

        const clientRect = this.progressRef.current.getBoundingClientRect();
        const currentX = Math.min(Math.max(event.clientX, clientRect.left), clientRect.right);
        const progress = (currentX - clientRect.left) / clientRect.width;

        audio.currentTime = audio.duration * progress;
    };
    private handleCursorMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!this.progressRef.current) {
            return;
        }

        this.cursorGrabbed = true;
        this.progressClientRect = this.progressRef.current.getBoundingClientRect();

        const currentX = Math.min(Math.max(event.clientX, this.progressClientRect.left), this.progressClientRect.right);
        this.grabbedProgress = (currentX - this.progressClientRect.left) / this.progressClientRect.width;

        event.stopPropagation();
    };
    private handleCursorMouseMove = (event: MouseEvent) => {
        if (!this.cursorGrabbed || !this.progressClientRect) {
            return;
        }

        const currentX = Math.min(Math.max(event.clientX, this.progressClientRect.left), this.progressClientRect.right);
        this.grabbedProgress = (currentX - this.progressClientRect.left) / this.progressClientRect.width;
    };
    private handleCursorMouseUp = () => {
        if (!this.cursorGrabbed) {
            return;
        }

        const audio = this.props.getAudio();
        if (!audio) {
            return;
        }

        audio.currentTime = audio.duration * this.grabbedProgress;

        this.cursorGrabbed = false;
        this.grabbedProgress = 0;
        this.progressClientRect = null;
    };

    public render() {
        return (
            <Root>
                <ProgressWrapper>
                    <PlayTime>
                        <Typography variant="body1" fontSize="0.85rem">
                            <span ref={this.currentTimeRef}>0:00:00</span>
                        </Typography>
                    </PlayTime>
                    <Box display="flex" alignItems="center" flex="1 1 auto" onClick={this.handleProgressWrapperClick}>
                        <Progress ref={this.progressRef}>
                            <Filled ref={this.filledRef} />
                            <Cursor onMouseDown={this.handleCursorMouseDown} ref={this.cursorRef} />
                        </Progress>
                    </Box>
                    <PlayTime>
                        <Typography variant="body1" fontSize="0.85rem">
                            <span ref={this.durationRef}>0:00:00</span>
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
