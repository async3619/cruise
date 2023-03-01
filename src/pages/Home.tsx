import React from "react";

import { Typography } from "@mui/material";

import Page from "@components/Page";

import { Root } from "@pages/Home.styles";

export interface HomeProps {}
export interface HomeStates {}

export default class Home extends React.Component<HomeProps, HomeStates> {
    public state: HomeStates = {};

    public render() {
        return (
            <Page title="Home">
                <Root>
                    <Typography>Home</Typography>
                </Root>
            </Page>
        );
    }
}
