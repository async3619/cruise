import React from "react";

import { Root } from "./Settings.styles";

export interface SettingsProps {}
export interface SettingsStates {}

export default class Settings extends React.Component<SettingsProps, SettingsStates> {
    public render() {
        return (
            <Root>
                <span>Settings</span>
            </Root>
        );
    }
}
