import React from "react";

import { Root } from "@pages/Home.styles";
import { Typography } from "@mui/material";

export interface HomeProps {}
export interface HomeStates {}

export default class Home extends React.Component<HomeProps, HomeStates> {
    public state: HomeStates = {};

    public render() {
        return (
            <Root>
                <Typography>Home</Typography>
            </Root>
        );
    }
}
