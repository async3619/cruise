import LibraryContext, { LibraryContextValue } from "@library/context";
import React from "react";

export default function useLibrary(): LibraryContextValue {
    return React.useContext(LibraryContext);
}
