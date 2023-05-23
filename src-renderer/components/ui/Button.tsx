import React from "react";

import { Button as MuiButton } from "@mui/material";

import { Root } from "@components/ui/Button.styles";

export interface ButtonProps extends React.ComponentProps<typeof MuiButton> {
    beforeIcon?: React.ReactNode;
}

export function Button({ beforeIcon, children, ...props }: ButtonProps) {
    return (
        <Root {...props}>
            {beforeIcon}
            <span>{children}</span>
        </Root>
    );
}
