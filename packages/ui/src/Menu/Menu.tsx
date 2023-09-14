import React from "react";
import { nanoid } from "nanoid";
import { InternalType, Nullable } from "types";

import { ButtonMenuItem } from "./ButtonMenuItem";
import { LabelMenuItem } from "./LabelMenuItem";

import { Divider, Root } from "./Menu.styles";
import { MenuItem, ButtonMenuItem as ButtonMenuItemType } from "./Menu.types";

export interface MenuProps {
    items: MenuItem[];
    selectedId?: Nullable<string>;
    onClick?(item: ButtonMenuItemType): void;
    standalone?: boolean;
}

export function Menu({ items, selectedId, onClick, standalone = true }: MenuProps) {
    const menuItems = React.useMemo<InternalType<MenuItem>[]>(() => {
        return items.map(item => ({
            key: nanoid(),
            ...item,
        }));
    }, [items]);

    const handleClick = React.useCallback(
        (item: ButtonMenuItemType) => {
            if (onClick) {
                onClick(item);
            }

            if (item.onClick) {
                item.onClick();
            }
        },
        [onClick],
    );

    return (
        <Root standalone={standalone} data-testid="root">
            {menuItems.map((item, index) => {
                switch (item.type) {
                    case "button":
                        return (
                            <ButtonMenuItem
                                key={item.key}
                                item={item}
                                active={selectedId === item.id}
                                onClick={() => handleClick(item)}
                            />
                        );

                    case "label":
                        return <LabelMenuItem key={item.key} item={item} />;

                    case "divider":
                        return <Divider key={`divider-${index}`} data-testid="menu-divider" />;

                    default:
                        throw new Error(`Unknown menu item type: ${(item as any).type}`);
                }
            })}
        </Root>
    );
}
