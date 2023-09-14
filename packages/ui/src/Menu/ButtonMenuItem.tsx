import React from "react";

import { Box, Stack, Tooltip, Typography } from "@mui/material";

import { ButtonMenuItem as ItemType, IconButtonItem } from "./Menu.types";
import { Icon, IconButton, Root } from "./ButtonMenuItem.styles";

export interface ButtonMenuItemProps {
    item: ItemType;
    active?: boolean;
    onClick?(item: ItemType): void;
}

export function ButtonMenuItem({ item, active, onClick }: ButtonMenuItemProps) {
    const { label, icon, iconButtons } = item;

    const handleClick = React.useCallback(() => {
        onClick?.(item);
    }, [onClick, item]);

    const handleDeleteButton = React.useCallback((iconButton: IconButtonItem) => {
        iconButton.onClick();
    }, []);

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
            {iconButtons && (
                <>
                    <Box flex="1 1 auto" />
                    <Stack direction="row" className="icon-buttons">
                        {iconButtons.map((iconButton, index) => (
                            <Tooltip title={iconButton.tooltip} key={index}>
                                <IconButton
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            handleDeleteButton(iconButtons[index]);
                                        }
                                    }}
                                    onClick={e => {
                                        handleDeleteButton(iconButtons[index]);
                                        e.stopPropagation();
                                    }}
                                >
                                    {iconButton.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Stack>
                </>
            )}
        </Root>
    );
}
