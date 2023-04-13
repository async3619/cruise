import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import Page from "@components/Page/index";

import { QueryHookOptions, QueryResult } from "@apollo/client";

export interface SearchPageProps<TData> {
    useQuery(options: QueryHookOptions<TData, { query: string }>): QueryResult<TData, { query: string }>;
    children(data: TData): React.ReactNode;
    query?: string;
    title?: string;
}

export default function SearchPage<TData>({ useQuery, children, query, title }: SearchPageProps<TData>) {
    if (!query) {
        throw new Error("Query is not provided");
    }

    const pageTitle = title || `Search results for "${query}"`;
    const { data, loading, error } = useQuery({
        variables: {
            query,
        },
    });

    let content: React.ReactNode;
    if (loading) {
        content = (
            <Box py={2} display="flex" justifyContent="center">
                <CircularProgress size={36} />
            </Box>
        );
    }

    if (!loading && !data) {
        const currentError = error || new Error("Unknown error");
        content = <Typography color="error">{currentError.message}</Typography>;
    }

    if (!loading && data) {
        content = children(data);
    }

    return <Page title={pageTitle}>{content}</Page>;
}
