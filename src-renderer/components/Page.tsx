import React from "react";

import { Content, Header, Root } from "./Page.styles";
import { Typography } from "@mui/material";

export interface PageProps {
    title?: string;
    children: React.ReactNode;
}

export function Page({ title, children }: PageProps) {
    return (
        <Root>
            <Header>
                {title && (
                    <Typography variant="h2" fontSize="2rem" lineHeight={1}>
                        {title}
                    </Typography>
                )}
            </Header>
            <Content>{children}</Content>
        </Root>
    );
}
