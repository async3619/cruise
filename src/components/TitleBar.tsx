import React from "react";

import { Typography } from "@mui/material";

import WindowControl from "@components/WindowControl";

import { Icon, Root } from "@components/TitleBar.styles";

export interface TitleBarProps {}
export interface TitleBarStates {}

export default class TitleBar extends React.Component<TitleBarProps, TitleBarStates> {
    public render() {
        return (
            <Root data-tauri-drag-region>
                <Icon src="/icon.svg" alt="Application Icon" />
                <Typography variant="body1" fontSize="0.85rem">
                    Cruise
                </Typography>
                <WindowControl />
            </Root>
        );
    }
}
