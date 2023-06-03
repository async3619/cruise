import React from "react";

import { Chip, Stack } from "@mui/material";

export interface ChipItem<T> {
    label: string;
    value: T;
}

export interface ChipListProps<T> {
    onChange(value: T): void;
    value: T;
    items: ChipItem<T>[];
}

export function ChipList<T>({ value, items, onChange }: ChipListProps<T>) {
    return (
        <Stack direction="row" spacing={1.5}>
            {items.map((item, index) => (
                <Chip
                    key={`${item.label}:${index}`}
                    label={item.label}
                    onClick={() => onChange(item.value)}
                    color={value === item.value ? "primary" : undefined}
                />
            ))}
        </Stack>
    );
}
