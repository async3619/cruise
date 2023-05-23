import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import { Content, Header, Root } from "./index.styles";

export interface PageProps {
    title?: string;
    children?: React.ReactNode;
    loading?: boolean;
    renderHeader?(title?: string): React.ReactNode;
}

export function Page({ title, children, loading, renderHeader }: PageProps) {
    return (
        <Root>
            <Header>
                {title && !renderHeader && (
                    <Typography variant="h2" fontSize="2rem" lineHeight={1}>
                        {title}
                    </Typography>
                )}
                {renderHeader && renderHeader(title)}
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
