import React from "react";

import { Typography } from "@mui/material";

import { Content, Header, Root } from "@components/Page/index.styles";

export interface PageProps {
    children: React.ReactNode;
    title: string;
}

export function Page({ children, title }: PageProps) {
    return (
        <Root>
            <Header>
                <Typography variant="h2" fontSize="1.85rem">
                    {title}
                </Typography>
            </Header>
            <Content>{children}</Content>
        </Root>
    );
}
