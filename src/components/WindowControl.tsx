import React from "react";

import { Dismiss24Regular, MaximizeRegular, SquareMultiple20Regular } from "@fluentui/react-icons";
import { appWindow } from "@tauri-apps/api/window";

import { Button, MinimizeIcon, Root } from "./WindowControl.styles";

export interface WindowControlProps {}
export interface WindowControlStates {
    maximized: boolean;
}

export default class WindowControl extends React.Component<WindowControlProps, WindowControlStates> {
    public state: WindowControlStates = {
        maximized: false,
    };

    public async componentDidMount() {
        await this.handleResize();
        await appWindow.onResized(this.handleResize);
    }

    private handleResize = async () => {
        const maximized = await appWindow.isMaximized();
        this.setState({ maximized });
    };
    private handleMinimize = () => {
        appWindow.minimize().then();
    };
    private handleMaximize = () => {
        const { maximized } = this.state;

        if (maximized) {
            appWindow.unmaximize().then();
        } else {
            appWindow.maximize().then();
        }
    };
    private handleClose = () => {
        appWindow.close().then();
    };

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
