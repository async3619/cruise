import React from "react";

import { Typography } from "@mui/material";

import { Header, Main, Root } from "@components/Page/index.styles";

export interface PageProps {
    title: string;
    renderHeader?(title: string): React.ReactNode;
    children?: React.ReactNode;
}
export interface PageStates {}

export default class Page extends React.Component<PageProps, PageStates> {
    public render() {
        const { renderHeader, title, children } = this.props;
        const titleNode: React.ReactNode = (
            <Typography variant="h4" lineHeight={1} gutterBottom>
                {title}
            </Typography>
        );

        let headerNode: React.ReactNode = titleNode;
        if (renderHeader) {
            headerNode = renderHeader(title);
        }

        return (
            <Root>
                <Header>{headerNode}</Header>
                <Main>{children}</Main>
            </Root>
        );
    }
}
