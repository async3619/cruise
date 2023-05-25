import React from "react";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";

import { useLayout } from "@components/Layout";

import { Root } from "@components/VirtualizedList.styles";

export interface VirtualizedListProps<TItem> {
    children: (virtualItem: VirtualItem, item: TItem) => React.ReactNode;
    rowHeight: number;
    items: TItem[];
}

export function VirtualizedList<TItem>({ rowHeight, children, items }: VirtualizedListProps<TItem>) {
    const { scrollView } = useLayout();
    const [initialScrollTop, setInitialScrollTop] = React.useState(0);
    const handleRef = (element: HTMLDivElement | null) => {
        if (!element) {
            return;
        }

        setInitialScrollTop(element.offsetTop);
    };

    const virtualizer = useVirtualizer({
        count: items.length,
        estimateSize: () => rowHeight,
        scrollMargin: initialScrollTop,
        getScrollElement: () => scrollView,
    });

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <Root ref={handleRef}>
            <div style={{ height: virtualizer.getTotalSize(), width: "100%", position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualItems[0].start - virtualizer.options.scrollMargin}px)`,
                    }}
                >
                    {virtualItems.map(row => (
                        <div key={row.index} data-index={row.index} style={{ height: rowHeight }}>
                            {children(row, items[row.index])}
                        </div>
                    ))}
                </div>
            </div>
        </Root>
    );
}
