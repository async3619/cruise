import React from "react";

import { Item, Root } from "./IconTab.styles";
import { Stack, Tooltip } from "@mui/material";

export interface IconTabItem<T extends string> {
    id: T;
    label: string;
    icon: React.ReactNode;
}

export interface IconTabProps<T extends string> {
    items: IconTabItem<T>[];
    value?: T;
    onChange?: (value: T) => void;
}

export function IconTab<T extends string>({ items, value, onChange }: IconTabProps<T>) {
    return (
        <Root data-testid="IconTab">
            <Stack direction="row" spacing={1}>
                {items.map(item => (
                    <Tooltip key={item.id} title={item.label}>
                        <Item
                            active={value === item.id}
                            onClick={() => onChange?.(item.id)}
                            data-testid={`item-${value === item.id ? "selected" : "normal"}`}
                        >
                            {item.icon}
                        </Item>
                    </Tooltip>
                ))}
            </Stack>
        </Root>
    );
}
