import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Box, Divider, Stack, Tooltip, Typography } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { IconButtonContainer, Item, ItemProps, Root, Title } from "@components/Menu.styles";

export interface NormalMenuItem {
    id: string;
    label: string;
    icon?: React.ComponentType;
    href?: string;
    hrefAliases?: string[];
    onClick?: () => void;
    onDelete?: () => void;
}

export type DividerMenuItem = "divider";

export type MenuItem = NormalMenuItem | DividerMenuItem;

export interface MenuProps {
    items: MenuItem[];
    onClick?: () => void;
    title?: string;
    standalone?: boolean;
}

export function Menu({ items, title, standalone, onClick }: MenuProps) {
    const location = useLocation();
    const { t } = useTranslation();
    const handleClick = (item: NormalMenuItem) => {
        item.onClick?.();
        onClick?.();
    };

    const content = (
        <Stack spacing={0.75}>
            {title && (
                <Typography component={Title} fontSize="0.875rem" fontWeight={600} color="text.disabled">
                    {title}
                </Typography>
            )}
            {items.map((item, index) => {
                if (item === "divider") {
                    return <Divider key={index} />;
                }

                const Icon = item.icon;
                let props: ItemProps = {
                    key: item.id,
                    onClick: item.onClick,
                };

                if (item.href) {
                    props = {
                        ...props,
                        to: item.href,
                        component: Link,
                    };
                }

                let isSelected = false;
                if (item.hrefAliases) {
                    isSelected = item.hrefAliases.some(alias => location.pathname.startsWith(alias));
                }

                if (!isSelected && item.href) {
                    isSelected = location.pathname === item.href;
                }

                return (
                    <Item selected={isSelected} {...props} onClick={() => handleClick(item)}>
                        {Icon && <Icon />}
                        <Typography variant="body1" fontSize="inherit">
                            {item.label}
                        </Typography>
                        <Box flex="1 1 auto" />
                        <IconButtonContainer>
                            {item.onDelete && (
                                <Tooltip title={t("dialog.deletePlaylist.title")} placement="top">
                                    <button
                                        onMouseDown={e => e.stopPropagation()}
                                        onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            item.onDelete?.();
                                        }}
                                    >
                                        <DeleteRoundedIcon fontSize="inherit" />
                                    </button>
                                </Tooltip>
                            )}
                        </IconButtonContainer>
                    </Item>
                );
            })}
        </Stack>
    );

    if (standalone) {
        return content;
    }

    return <Root>{content}</Root>;
}
