import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Stack, Typography } from "@mui/material";

import { Item, ItemProps, Title } from "./Menu.styles";

export interface MenuItem {
    id: string;
    label: string;
    icon?: React.ComponentType;
    href?: string;
    hrefAliases?: string[];
    onClick?: () => void;
}

export interface MenuProps {
    items: MenuItem[];
    title?: string;
}

export function Menu({ items, title }: MenuProps) {
    const location = useLocation();

    return (
        <Stack spacing={0.75}>
            {title && (
                <Typography component={Title} fontSize="0.875rem" fontWeight={600} color="text.disabled">
                    {title}
                </Typography>
            )}
            {items.map(item => {
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
                    <Item selected={isSelected} {...props}>
                        {Icon && <Icon />}
                        {item.label}
                    </Item>
                );
            })}
        </Stack>
    );
}
