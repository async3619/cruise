import React from "react";

import { Typography } from "@mui/material";

import { Root, Title } from "@components/Layout/Header.styles";

export interface HeaderProps {}

export function Header({}: HeaderProps) {
    return (
        <Root>
            <Typography component={Title} variant="h1" fontSize="0.9rem" lineHeight={1} fontWeight={600}>
                <span>Cruise</span>
            </Typography>
        </Root>
    );
}
