import React from "react";

import { Library } from "@components/Library";

export interface LibraryProviderProps {
    children: React.ReactNode;
}

export interface LibraryContextValue {
    library: Library;
}

export const LibraryContext = React.createContext<LibraryContextValue>({
    library: {} as Library,
});

export function LibraryProvider(props: LibraryProviderProps) {
    const [library] = React.useState<Library>(new Library());

    return <LibraryContext.Provider value={{ library }}>{props.children}</LibraryContext.Provider>;
}

export function useLibrary() {
    const { library } = React.useContext(LibraryContext);

    return library;
}
