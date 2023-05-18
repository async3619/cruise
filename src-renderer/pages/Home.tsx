import React from "react";

import { Box, Button } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

import { Root } from "@pages/Home.styles";

export interface HomeProps {}

export function Home({}: HomeProps) {
    const { mode, setMode } = useColorScheme();

    return (
        <Root>
            <span>Home</span>
            <Box flex="1 1 auto" />
            <Button
                variant="contained"
                onClick={() => {
                    setMode(mode === "light" ? "dark" : "light");
                }}
            >
                Toggle Mode
            </Button>
        </Root>
    );
}
