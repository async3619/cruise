import React from "react";
import useMeasure from "react-use-measure";
import { mergeRefs } from "react-merge-refs";

import { Box, CircularProgress, Typography } from "@mui/material";

import { Content, FixedHelper, Header, Root, ToolbarPlaceholder } from "@components/Page/index.styles";

export interface PageProps {
    children?: React.ReactNode;
    header: string | React.ReactNode;
    loading?: boolean;
    headerRef?: React.Ref<HTMLDivElement>;
    headerPosition?: "fixed" | "sticky";
    toolbar?: React.ReactNode;
    contentKey?: string;
}

export function Page({
    children,
    header,
    headerRef,
    loading = false,
    headerPosition = "sticky",
    toolbar,
    contentKey,
}: PageProps) {
    const [ref, { height: headerHeight }] = useMeasure();
    const [initialHeight, setInitialHeight] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (initialHeight !== null || !headerHeight) {
            return;
        }

        setInitialHeight(headerHeight);
    }, [headerHeight, initialHeight]);

    let content = children;
    if (loading) {
        content = (
            <Box py={2} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    const headerRefs: React.Ref<Element>[] = [ref];
    if (headerRef) {
        headerRefs.push(headerRef);
    }

    let headerStyle: React.CSSProperties = {};
    if (headerPosition === "fixed") {
        headerStyle = {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
        };
    }

    let headerNode = (
        <Header ref={mergeRefs(headerRefs)} style={headerStyle} hasToolbar={!!toolbar}>
            {typeof header === "string" && (
                <Typography variant="h2" fontSize="1.85rem">
                    {header}
                </Typography>
            )}
            {typeof header !== "string" && header}
            {toolbar}
        </Header>
    );

    if (headerPosition === "fixed") {
        headerNode = <FixedHelper ref={headerRef}>{headerNode}</FixedHelper>;
    }

    return (
        <Root>
            {headerNode}
            {loading && (
                <Content
                    key={contentKey}
                    style={{ paddingTop: headerPosition === "fixed" ? initialHeight ?? 0 : undefined }}
                >
                    {content}
                </Content>
            )}
            {!loading && (
                <Content
                    key={contentKey}
                    style={{ paddingTop: headerPosition === "fixed" ? initialHeight ?? 0 : undefined }}
                >
                    {toolbar && <ToolbarPlaceholder />}
                    {content}
                </Content>
            )}
        </Root>
    );
}
