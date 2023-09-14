import React from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

export interface VirtualizedListProps<T> {
    items: T[];
    scrollElement?: HTMLElement | null;
    children: (item: T, index: number) => React.ReactNode;
    estimateSize: (index: number) => number;
}

export function VirtualizedList<T>({ children, items, estimateSize, scrollElement }: VirtualizedListProps<T>) {
    const virtualizer = useVirtualizer({
        count: items.length,
        estimateSize,
        getScrollElement: () => scrollElement || null,
        overscan: 5,
    });

    return (
        <div
            style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
            }}
        >
            {virtualizer.getVirtualItems().map(virtualItem => (
                <div
                    key={virtualItem.key}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                    }}
                >
                    {children(items[virtualItem.index], virtualItem.index)}
                </div>
            ))}
        </div>
    );
}
