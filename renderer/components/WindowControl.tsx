import React from "react";

import { Dismiss24Regular, MaximizeRegular, SquareMultiple20Regular } from "@fluentui/react-icons";

import { Button, MinimizeIcon, Root } from "./WindowControl.styles";

export interface WindowControlProps {}
export interface WindowControlStates {
    maximized: boolean;
}

export default class WindowControl extends React.Component<WindowControlProps, WindowControlStates> {
    public state: WindowControlStates = {
        maximized: false,
    };

    public async componentDidMount() {}

    private handleResize = async () => {};
    private handleMinimize = () => {};
    private handleMaximize = () => {};
    private handleClose = () => {};

    public render() {
        const { maximized } = this.state;

        return (
            <Root>
                <Button onClick={this.handleMinimize}>
                    <MinimizeIcon />
                </Button>
                <Button onClick={this.handleMaximize}>
                    {maximized ? <SquareMultiple20Regular /> : <MaximizeRegular />}
                </Button>
                <Button close onClick={this.handleClose}>
                    <Dismiss24Regular />
                </Button>
            </Root>
        );
    }
}
