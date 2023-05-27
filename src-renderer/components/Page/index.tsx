import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import { Content, DenseHeader, FixedHelper, Header, Root } from "./index.styles";
import useMeasure from "react-use-measure";
import { mergeRefs } from "react-merge-refs";

export interface PageProps {
    denseHeaderMargin?: boolean;
    title?: string;
    children?: React.ReactNode;
    loading?: boolean;
    headerPosition?: "fixed" | "sticky";
    headerRef?: React.Ref<HTMLDivElement>;
    renderHeader?(title?: string): React.ReactNode;
}

export function Page({
    title,
    children,
    loading,
    renderHeader,
    headerPosition = "sticky",
    headerRef,
    denseHeaderMargin = false,
}: PageProps) {
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

    const headerRefs: React.Ref<Element>[] = [ref];
    if (headerRef) {
        headerRefs.push(headerRef);
    }

    const HeaderComponent = denseHeaderMargin ? DenseHeader : Header;
    let header: React.ReactNode = (
        <HeaderComponent ref={mergeRefs(headerRefs)} style={headerStyle}>
            {title && !renderHeader && (
                <Typography variant="h2" fontSize="2rem" lineHeight={1}>
                    {title}
                </Typography>
            )}
            {renderHeader && renderHeader(title)}
        </HeaderComponent>
    );

    if (headerPosition === "fixed") {
        header = <FixedHelper ref={headerRef}>{header}</FixedHelper>;
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
