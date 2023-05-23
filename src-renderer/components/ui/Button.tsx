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
            {typeof children === "string" && <span>{children}</span>}
            {typeof children !== "string" && children}
        </Root>
    );
}
