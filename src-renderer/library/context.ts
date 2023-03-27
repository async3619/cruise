import React from "react";

export interface LibraryContextValue {
    scan(): Promise<void>;
}

const LibraryContext = React.createContext<LibraryContextValue>({
    scan: () => {
        throw new Error("Not implemented");
    },
});

export default LibraryContext;
