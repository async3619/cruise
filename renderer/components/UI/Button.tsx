import React from "react";

import { Root } from "./Button.styles";
import { Typography } from "@mui/material";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children: string;
    icon?: React.ComponentType;
}
export interface ButtonStates {}

export default class Button extends React.Component<ButtonProps, ButtonStates> {
    public render() {
        const { children, icon: Icon, ...props } = this.props;

        return (
            <Root {...props}>
                {Icon && <Icon />}
                <Typography lineHeight={1}>{children}</Typography>
            </Root>
        );
    }
}
