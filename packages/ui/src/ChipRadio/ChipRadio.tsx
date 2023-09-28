import React from "react";

import { Root } from "./ChipRadio.styles";
import { Chip } from "@mui/material";

export interface ChipRadioItem<T> {
    label: string;
    value: T;
}

export interface ChipRadioProps<T> {
    items: ChipRadioItem<T>[];
    value?: T;
    onChange?(value: T): void;
    size?: "small" | "medium";
}

export function ChipRadio<T>({ items, value, onChange, size }: ChipRadioProps<T>) {
    return (
        <Root data-testid="ChipRadio">
            {items.map(item => (
                <Chip
                    data-testid={`chip-radio-item${value === item.value ? "-selected" : ""}`}
                    size={size}
                    key={item.label}
                    title={item.label}
                    label={item.label}
                    color={value === item.value ? "primary" : "default"}
                    onClick={() => onChange?.(item.value)}
                />
            ))}
        </Root>
    );
}
