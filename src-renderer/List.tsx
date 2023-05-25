import React from "react";

import { Stack } from "@mui/material";

import { VirtualizedList, VirtualizedListProps as BaseVirtualizedListProps } from "@components/VirtualizedList";

export interface NormalListProps<TItem> {
    virtualized?: false;
    children: (item: TItem) => React.ReactNode;
    items: TItem[];
    spacing?: number;
}
export interface VirtualizedListProps<TItem> extends Omit<BaseVirtualizedListProps<TItem>, "items"> {
    virtualized: true;
    items: TItem[];
}

export type ListProps<TItem> = NormalListProps<TItem> | VirtualizedListProps<TItem>;

export function List<TItem>(props: ListProps<TItem>) {
    if (props.virtualized) {
        const { virtualized: _, ...rest } = props;

        return <VirtualizedList {...rest} />;
    }

    const { spacing } = props;

    return (
        <Stack spacing={spacing}>
            {props.items.map((item, index) => (
                <React.Fragment key={index}>{props.children(item)}</React.Fragment>
            ))}
        </Stack>
    );
}
