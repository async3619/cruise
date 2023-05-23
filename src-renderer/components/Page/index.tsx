import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import { Content, FixedHelper, Header, Root } from "./index.styles";
import useMeasure from "react-use-measure";

export interface PageProps {
    title?: string;
    children?: React.ReactNode;
    loading?: boolean;
    headerPosition?: "fixed" | "sticky";
    renderHeader?(title?: string): React.ReactNode;
}

export function Page({ title, children, loading, renderHeader, headerPosition = "sticky" }: PageProps) {
    const [ref, { height: headerHeight }] = useMeasure();
    const [initialHeight, setInitialHeight] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (initialHeight !== null || !headerHeight) {
            return;
        }

        setInitialHeight(headerHeight);
    }, [headerHeight, initialHeight]);

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

    let header: React.ReactNode = (
        <Header ref={ref} style={headerStyle}>
            {title && !renderHeader && (
                <Typography variant="h2" fontSize="2rem" lineHeight={1}>
                    {title}
                </Typography>
            )}
            {renderHeader && renderHeader(title)}
        </Header>
    );

    if (headerPosition === "fixed") {
        header = <FixedHelper>{header}</FixedHelper>;
    }

    return (
        <Root>
            {header}
            <Content style={{ paddingTop: headerPosition === "fixed" ? initialHeight ?? 0 : undefined }}>
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
