import React from "react";

import { Box, Button, Typography } from "@mui/material";
import * as commands from "@commands";

import { Root } from "@pages/Home.styles";

export interface HomeProps {}
export interface HomeStates {
    counter: number;
    hello: string;
}

export default class Home extends React.Component<HomeProps, HomeStates> {
    public state: HomeStates = {
        counter: 0,
        hello: "Hello world from Cruise.",
    };

    public componentDidMount() {
        commands.greet("Cruise").then((hello: string) => {
            this.setState({ hello });
        });
    }

    public handleIncrementClick = () => {
        this.setState(state => ({ counter: state.counter + 1 }));
    };

    public render() {
        const { counter, hello } = this.state;

        return (
            <Root>
                <Box>
                    <Typography variant="h4" fontWeight="600">
                        {hello}
                    </Typography>
                </Box>
                <Box mt={4} mb={1}>
                    <Typography>Counter: {counter}</Typography>
                </Box>
                <Box>
                    <Button variant="contained" onClick={this.handleIncrementClick}>
                        Increment
                    </Button>
                </Box>
            </Root>
        );
    }
}
