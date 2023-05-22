import React from "react";

import { Rail, Root, Thumb, Track } from "@components/ui/Slider.styles";

export interface SliderProps {
    onValueChange?(value: number): void;
    onValueChangeEnd?(value: number): void;
    min: number;
    max: number;
    value: number;
    disabled?: boolean;
}
export interface SliderStates {
    dragging: boolean;
}

export class Slider extends React.PureComponent<SliderProps, SliderStates> {
    private readonly thumbRef = React.createRef<HTMLDivElement>();
    private readonly trackRef = React.createRef<HTMLDivElement>();
    private readonly railRef = React.createRef<HTMLDivElement>();

    private unmounted = false;

    private trackBoundingRect: DOMRect | null = null;
    private mouseX = 0;
    private mouseY = 0;
    private value = 0;

    public state: SliderStates = {
        dragging: false,
    };

    public componentDidMount() {
        window.requestAnimationFrame(this.handleFrame);

        window.addEventListener("mousemove", this.handleMouseMove, false);
        window.addEventListener("mouseup", this.handleMouseUp, false);
    }
    public componentWillUnmount() {
        window.removeEventListener("mousemove", this.handleMouseMove, false);
        window.removeEventListener("mouseup", this.handleMouseUp, false);
        this.unmounted = true;
    }

    public componentDidUpdate(prevProps: Readonly<SliderProps>) {
        if (!this.state.dragging) {
            if (
                prevProps.value !== this.props.value ||
                prevProps.min !== this.props.min ||
                prevProps.max !== this.props.max
            ) {
                this.calculateValue();
            }
        }
    }

    private calculateValue() {
        const { min, max, value } = this.props;
        const m = max - min;

        this.value = (value - min) / m;
    }
    private calculateDraggingValue(dragging = this.state.dragging) {
        if (!this.trackBoundingRect || !dragging) {
            return;
        }

        const { left, width } = this.trackBoundingRect;
        const { mouseX } = this;

        this.value = Math.min(Math.max((mouseX - left) / width, 0), 1);
    }

    private handleFrame = () => {
        if (this.unmounted) {
            return;
        }

        window.requestAnimationFrame(this.handleFrame);

        if (!this.thumbRef.current || !this.railRef.current) {
            return;
        }

        this.railRef.current.style.width = `${this.value * 100}%`;
        this.thumbRef.current.style.left = `${this.value * 100}%`;
    };

    private handleMouseMove = (event: MouseEvent) => {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;

        this.calculateDraggingValue();
    };
    private handleMouseDown = () => {
        this.trackBoundingRect = this.trackRef.current?.getBoundingClientRect() ?? null;
        this.setState({ dragging: true });

        this.calculateDraggingValue(true);
    };
    private handleMouseUp = () => {
        if (!this.state.dragging) {
            return;
        }

        this.trackBoundingRect = null;
        this.setState({ dragging: false });

        this.calculateDraggingValue(true);
        this.props.onValueChangeEnd?.(this.value * (this.props.max - this.props.min) + this.props.min);
    };

    public render() {
        const { disabled } = this.props;
        const { dragging } = this.state;

        return (
            <Root onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
                <Track ref={this.trackRef}>
                    {!disabled && <Thumb ref={this.thumbRef} style={{ opacity: dragging ? 1 : undefined }} />}
                    {!disabled && <Rail active={dragging} ref={this.railRef} />}
                </Track>
            </Root>
        );
    }
}
