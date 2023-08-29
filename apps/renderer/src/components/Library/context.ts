import React from "react";

import { Library } from "@components/Library";

export interface LibraryContextValues {
    library: Library;
}

export const LibraryContext = React.createContext<LibraryContextValues | null>(null);

export function useLibrary(): Library {
    const context = React.useContext(LibraryContext);
    if (!context) {
        throw new Error("useLibrary must be used within a <LibraryProvider />");
    }

    return context.library;
}
