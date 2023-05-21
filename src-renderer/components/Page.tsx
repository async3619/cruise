import React from "react";

import { Content, Header, Root } from "./Page.styles";
import { Box, CircularProgress, Typography } from "@mui/material";

export interface PageProps {
    title?: string;
    children?: React.ReactNode;
    loading?: boolean;
}

export function Page({ title, children, loading }: PageProps) {
    return (
        <Root>
            <Header>
                {title && (
                    <Typography variant="h2" fontSize="2rem" lineHeight={1}>
                        {title}
                    </Typography>
                )}
            </Header>
            <Content>
                {!loading && children}
                {loading && (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress size={36} />
                    </Box>
                )}
            </Content>
        </Root>
    );
}
