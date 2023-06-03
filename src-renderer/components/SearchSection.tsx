import React from "react";

import { Box, Button, Typography } from "@mui/material";

import { Root } from "@components/SearchSection.styles";

export interface SearchSectionProps {
    title?: string;
    children?: React.ReactNode;
    onMoreClick?(): void;
}

export function SearchSection({ title, children, onMoreClick }: SearchSectionProps) {
    return (
        <Root>
            <Box height={32} mb={2} display="flex" alignItems="center">
                <Typography variant="h3" fontSize="1.5rem" lineHeight={1} fontWeight={400}>
                    {title}
                </Typography>
                <Box flex="1 1 auto" />
                {!!onMoreClick && (
                    <Button variant="text" size="small" onClick={onMoreClick}>
                        더보기
                    </Button>
                )}
            </Box>
            {children}
        </Root>
    );
}
