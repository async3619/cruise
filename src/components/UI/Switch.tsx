import React from "react";

import { Root } from "./Switch.styles";

export interface SwitchProps {}
export interface SwitchStates {}

export default class Switch extends React.Component<SwitchProps, SwitchStates> {
    public render() {
        return (
            <Root>
                <span>Switch</span>
            </Root>
        );
    }
}
