import React from "react";

import { Box, Button, Typography } from "@mui/material";

import { Root } from "@components/SearchSection.styles";
import { Link } from "react-router-dom";

export interface SearchSectionProps {
    title?: string;
    children?: React.ReactNode;
    hasMore?: boolean;
    to?: string;
}

export function SearchSection({ title, children, hasMore, to }: SearchSectionProps) {
    return (
        <Root>
            <Box height={32} mb={2} display="flex" alignItems="center">
                <Typography variant="h3" fontSize="1.5rem" lineHeight={1} fontWeight={400}>
                    {title}
                </Typography>
                <Box flex="1 1 auto" />
                {hasMore && (
                    <>
                        {to && (
                            <Button component={Link} to={to} variant="text" size="small">
                                더보기
                            </Button>
                        )}
                        {!to && (
                            <Button variant="text" size="small">
                                더보기
                            </Button>
                        )}
                    </>
                )}
            </Box>
            {children}
        </Root>
    );
}
