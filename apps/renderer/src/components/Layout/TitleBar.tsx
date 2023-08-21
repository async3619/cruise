import React from "react";

import { Typography } from "@mui/material";

import { WindowControl } from "@components/Layout/WindowControl";
import { Root } from "@components/Layout/TitleBar.styles";

export function TitleBar() {
    return (
        <Root>
            <Typography variant="body1" fontSize="0.85rem" color="text.disabled">
                Cruise
            </Typography>
            <WindowControl />
        </Root>
    );
}
