import React from "react";

import { Button, Stack, Typography } from "@mui/material";

import { useCloseWindowMutation } from "@graphql/queries";

import { Root } from "@pages/Home.styles";

export function Home() {
    const [closeWindow] = useCloseWindowMutation();
    const [count, setCount] = React.useState(0);

    return (
        <Root>
            <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
                ⚡ Turborepo Electron Starter
            </Typography>
            <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={() => setCount(c => c + 1)}>
                    Counter: {count}
                </Button>
                <Button variant="contained" onClick={() => closeWindow()}>
                    Close App
                </Button>
            </Stack>
        </Root>
    );
}
