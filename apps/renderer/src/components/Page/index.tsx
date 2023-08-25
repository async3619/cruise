import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import { Content, Header, Root } from "@components/Page/index.styles";

export interface PageProps {
    children?: React.ReactNode;
    title: string;
    loading?: boolean;
}

export function Page({ children, title, loading = false }: PageProps) {
    let content = children;
    if (loading) {
        content = (
            <Box py={2} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Root>
            <Header>
                <Typography variant="h2" fontSize="1.85rem">
                    {title}
                </Typography>
            </Header>
            <Content>{content}</Content>
        </Root>
    );
}
