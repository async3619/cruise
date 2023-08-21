import React from "react";

import { Typography } from "@mui/material";

import { ButtonMenuItem as ItemType } from "./Menu.types";
import { Icon, Root } from "./ButtonMenuItem.styles";

export interface ButtonMenuItemProps {
    item: ItemType;
    active?: boolean;
    onClick?(item: ItemType): void;
}

export function ButtonMenuItem({ item, active, onClick }: ButtonMenuItemProps) {
    const { label, icon } = item;
    const handleClick = React.useCallback(() => {
        onClick?.(item);
    }, [onClick, item]);

    return (
        <Root
            active={active}
            data-testid="button-menu-item"
            aria-pressed={active ? "true" : "false"}
            onClick={handleClick}
        >
            <Icon active={active}>{icon}</Icon>
            <Typography variant="body1" component="span" fontSize="0.9rem" lineHeight={1}>
                {label}
            </Typography>
        </Root>
    );
}
