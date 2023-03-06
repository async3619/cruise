import React from "react";

import { Root } from "./SquaredIconButton.styles";

export interface SquaredIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}
export interface SquaredIconButtonStates {}

export default class SquaredIconButton extends React.Component<SquaredIconButtonProps, SquaredIconButtonStates> {
    public render() {
        const { children, ...rest } = this.props;

        return <Root {...rest}>{children}</Root>;
    }
}
