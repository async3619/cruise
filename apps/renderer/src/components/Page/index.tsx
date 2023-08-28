import React from "react";
import useMeasure from "react-use-measure";
import { mergeRefs } from "react-merge-refs";

import { Box, CircularProgress, Typography } from "@mui/material";

import { Content, FixedHelper, Header, Root } from "@components/Page/index.styles";

export interface PageProps {
    children?: React.ReactNode;
    header: string | React.ReactNode;
    loading?: boolean;
    headerRef?: React.Ref<HTMLDivElement>;
    headerPosition?: "fixed" | "sticky";
}

export function Page({ children, header, headerRef, loading = false, headerPosition = "sticky" }: PageProps) {
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
        <Header ref={mergeRefs(headerRefs)} style={headerStyle}>
            {typeof header === "string" && (
                <Typography variant="h2" fontSize="1.85rem">
                    {header}
                </Typography>
            )}
            {typeof header !== "string" && header}
        </Header>
    );

    if (headerPosition === "fixed") {
        headerNode = <FixedHelper ref={headerRef}>{headerNode}</FixedHelper>;
    }

    return (
        <Root>
            {headerNode}
            <Content style={{ paddingTop: headerPosition === "fixed" ? initialHeight ?? 0 : undefined }}>
                {content}
            </Content>
        </Root>
    );
}
