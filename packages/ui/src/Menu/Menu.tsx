import React from "react";
import { nanoid } from "nanoid";
import { InternalType, Nullable } from "types";

import { Stack } from "@mui/material";

import { ButtonMenuItem } from "./ButtonMenuItem";
import { LabelMenuItem } from "./LabelMenuItem";

import { Root } from "./Menu.styles";
import { MenuItem, ButtonMenuItem as ButtonMenuItemType } from "./Menu.types";

export interface MenuProps {
    items: MenuItem[];
    selectedId?: Nullable<string>;
    onClick?(item: ButtonMenuItemType): void;
}

export function Menu({ items, selectedId, onClick }: MenuProps) {
    const menuItems = React.useMemo<InternalType<MenuItem>[]>(() => {
        return items.map(item => ({
            key: nanoid(),
            ...item,
        }));
    }, [items]);

    return (
        <Root data-testid="root">
            <Stack spacing={0.5}>
                {menuItems.map(item => {
                    switch (item.type) {
                        case "button":
                            return (
                                <ButtonMenuItem
                                    key={item.key}
                                    item={item}
                                    active={selectedId === item.id}
                                    onClick={onClick}
                                />
                            );

                        case "label":
                            return <LabelMenuItem key={item.key} item={item} />;

                        default:
                            throw new Error(`Unknown menu item type: ${(item as any).type}`);
                    }
                })}
            </Stack>
        </Root>
    );
}
