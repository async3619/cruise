import React from "react";
import _ from "lodash";

export interface MediaSelection<T> {
    items: ReadonlyArray<T>;
    selectedIndices: ReadonlyArray<number>;
    selectedItem: ReadonlyArray<T>;
    setItems: (newItems: ReadonlyArray<T>) => void;
    selectItem: (index: number | number[]) => void;
    unselectItem: (index: number | number[]) => void;
    toggleItem: (index: number | number[]) => void;
    cancelAll: () => void;
    selectAll: () => void;
}

export function useMediaSelectionServer<T>() {
    const [items, setItems] = React.useState<ReadonlyArray<T>>([]);
    const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);

    const setMediaItems = React.useCallback(
        (newItems: ReadonlyArray<T>) => {
            if (newItems === items) {
                return;
            }

            setItems(newItems);
            setSelectedIndices([]);
        },
        [items],
    );

    const selectItem = React.useCallback((index: number | number[]) => {
        const newIndices = Array.isArray(index) ? index : [index];
        setSelectedIndices(oldItems => {
            const newItems = [...oldItems, ...newIndices];

            return _.chain(newItems)
                .orderBy(i => i, "asc")
                .uniq()
                .value();
        });
    }, []);
    const unselectItem = React.useCallback((index: number | number[]) => {
        const newIndices = Array.isArray(index) ? index : [index];
        setSelectedIndices(oldItems => {
            const newItems = [...oldItems];

            return _.chain(newItems)
                .difference(newIndices)
                .orderBy(i => i, "asc")
                .uniq()
                .value();
        });
    }, []);
    const toggleItem = React.useCallback((index: number | number[]) => {
        if (typeof index === "number") {
            setSelectedIndices(oldItems => {
                const newItems = [...oldItems];
                if (newItems.includes(index)) {
                    newItems.splice(newItems.indexOf(index), 1);
                } else {
                    newItems.push(index);
                }

                return _.orderBy(newItems, i => i, "asc");
            });
        } else {
            setSelectedIndices(oldItems => {
                const newItems = [...oldItems, ...index];

                return _.chain(newItems)
                    .orderBy(i => i, "asc")
                    .uniq()
                    .value();
            });
        }
    }, []);

    const cancelAll = React.useCallback(() => {
        setSelectedIndices([]);
    }, []);
    const checkAll = React.useCallback(() => {
        setSelectedIndices(_.range(items.length));
    }, [items]);

    return React.useMemo<MediaSelection<T>>(
        () => ({
            items,
            selectedIndices,
            selectedItem: selectedIndices.map(index => items[index]),
            setItems: setMediaItems,
            selectItem,
            unselectItem,
            toggleItem,
            cancelAll,
            selectAll: checkAll,
        }),
        [items, selectedIndices, setMediaItems, selectItem, unselectItem, toggleItem, cancelAll, checkAll],
    );
}
