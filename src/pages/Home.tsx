import React from "react";

import { Box } from "@mui/material";

import Page from "@components/Page";
import Button from "@components/UI/Button";

import { Root } from "@pages/Home.styles";

export interface HomeProps {}
export interface HomeStates {}

export default class Home extends React.Component<HomeProps, HomeStates> {
    public state: HomeStates = {};

    public render() {
        return (
            <Page title="Home">
                <Root>
                    <Box my={2}>
                        <Button>Button</Button>
                    </Box>
                    <Box my={2}>
                        <Button color="primary">Button</Button>
                    </Box>
                    <Box my={2}>
                        <Button color="secondary">Button</Button>
                    </Box>
                    <Box my={2}>
                        <Button>Button</Button>
                    </Box>
                </Root>
            </Page>
        );
    }
}
