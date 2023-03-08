import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

import { Typography } from "@mui/material";

import { Header, Main, Root } from "@components/Page/index.styles";

export interface PageProps {
    title: string;
    header?: ((title: string) => React.ReactNode) | React.ReactNode;
    children?: React.ReactNode;
}
export interface PageStates {}

export default class Page extends React.Component<PageProps, PageStates> {
    public render() {
        const { header, title, children } = this.props;
        const titleNode: React.ReactNode = (
            <Typography variant="h4" lineHeight={1}>
                {title}
            </Typography>
        );

        let headerNode: React.ReactNode = titleNode;
        if (header) {
            headerNode = typeof header === "function" ? header(title) : header;
        }

        return (
            <Root>
                <Header>{headerNode}</Header>
                <Scrollbars autoHide>
                    <Main>{children}</Main>
                </Scrollbars>
            </Root>
        );
    }
}
