import React from "react";

import { Typography } from "@mui/material";

import { Root } from "@components/UI/Button.styles";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children: string;
    icon?: React.ComponentType;
    color?: "primary" | "secondary";
}

export default function Button({ children, icon: Icon, ...props }: ButtonProps) {
    return (
        <Root {...props}>
            {Icon && <Icon />}
            <Typography lineHeight={1}>{children}</Typography>
        </Root>
    );
}
