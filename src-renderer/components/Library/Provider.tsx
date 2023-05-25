import React from "react";
import { useTranslation } from "react-i18next";

import { useApolloClient } from "@apollo/client";

import { useDialog } from "@components/Dialog/Provider";
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
    const client = useApolloClient();
    const { i18n } = useTranslation();
    const dialog = useDialog();
    const [library] = React.useState<Library>(new Library(client, dialog, i18n));

    return <LibraryContext.Provider value={{ library }}>{props.children}</LibraryContext.Provider>;
}

export function useLibrary() {
    const { library } = React.useContext(LibraryContext);

    return library;
}
