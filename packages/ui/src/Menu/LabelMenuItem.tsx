import React from "react";

import { Typography } from "@mui/material";

import { LabelMenuItem as ItemType } from "./Menu.types";
import { Root } from "./LabelMenuItem.styles";

export interface LabelMenuItemProps {
    item: ItemType;
}

export function LabelMenuItem({ item }: LabelMenuItemProps) {
    const { label } = item;

    return (
        <Root data-testid="label-menu-item">
            <Typography variant="body1" component="span" fontSize="0.9rem" lineHeight={1} color="text.disabled">
                {label}
            </Typography>
        </Root>
    );
}
