import React from "react";
import { SelectionContextValue } from "@components/Selection/context";
import { MinimalAlbum, MinimalMusic } from "@utils/types";
import { SelectionToolbar, SelectionToolbarProps } from "@components/Selection/Toolbar";

export interface SelectionProps<T> {
    items: T[];
    children: React.ReactNode;
}

export function createSelectionComponent<T>(
    name: string,
    getMusics: (items: T[], indices: number[]) => MinimalMusic[],
) {
    const Context = React.createContext<SelectionContextValue<T> | null>(null);
    const Component = ({ children, items }: SelectionProps<T>) => {
        const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
        const setSelection = React.useCallback((indices: number[]) => {
            setSelectedIndices(indices);
        }, []);

        React.useEffect(() => {
            setSelectedIndices([]);
        }, [items]);

        return (
            <Context.Provider value={{ selectedIndices, setSelection, allItems: items }}>{children}</Context.Provider>
        );
    };

    function useSelection() {
        return React.useContext(Context);
    }

    function Toolbar(props: Omit<SelectionToolbarProps<T>, "useSelection" | "getMusics">) {
        return <SelectionToolbar<T> {...props} useSelection={useSelection} getMusics={getMusics} />;
    }

    Component.displayName = name;
    Toolbar.displayName = `${name}Toolbar`;

    return { Component, useSelection, Toolbar };
}

export const {
    Component: MusicSelection,
    useSelection: useMusicSelection,
    Toolbar: MusicSelectionToolbar,
} = createSelectionComponent<MinimalMusic>("MusicSelection", (items, indices) => indices.map(index => items[index]));

export const {
    Component: AlbumSelection,
    useSelection: useAlbumSelection,
    Toolbar: AlbumSelectionToolbar,
} = createSelectionComponent<MinimalAlbum>("AlbumSelection", (items, indices) =>
    indices.map(index => items[index]).flatMap(album => album.musics),
);
