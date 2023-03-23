import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

import { Typography } from "@mui/material";

import { FloatingHeader, Header, Main, Root } from "@components/Page/index.styles";

export interface PageProps {
    title: string;
    header?: ((title: string) => React.ReactNode) | React.ReactNode;
    children?: React.ReactNode;
    floatingHeader?: boolean;
    onScroll?(e: React.UIEvent<HTMLDivElement>): void;
}
export interface PageStates {}

export default function Page(props: PageProps) {
    const { header, title, children, floatingHeader, onScroll } = props;
    const titleNode: React.ReactNode = (
        <Typography variant="h4" lineHeight={1}>
            {title}
        </Typography>
    );

    let headerNode: React.ReactNode = titleNode;
    if (header) {
        headerNode = typeof header === "function" ? header(title) : header;
    }

    const HeaderComponent = floatingHeader ? FloatingHeader : Header;

    return (
        <Root>
            <HeaderComponent>{headerNode}</HeaderComponent>
            <Scrollbars autoHide onScroll={onScroll}>
                <Main>{children}</Main>
            </Scrollbars>
        </Root>
    );
}
