import React from "react";

import { MusicSelectionContext } from "@components/Selection/Music.context";

import { MinimalMusic } from "@utils/types";

export interface MusicSelectionProps {
    items: MinimalMusic[];
    children: React.ReactNode;
}

export function MusicSelection({ children, items }: MusicSelectionProps) {
    const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
    const setSelection = React.useCallback((indices: number[]) => {
        setSelectedIndices(indices);
    }, []);

    React.useEffect(() => {
        setSelectedIndices([]);
    }, [items]);

    return (
        <MusicSelectionContext.Provider value={{ selectedIndices, setSelection, allItems: items }}>
            {children}
        </MusicSelectionContext.Provider>
    );
}
