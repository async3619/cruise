import React from "react";

import { Library } from "@components/Library";
import { LibraryContext } from "@components/Library/context";

import { useApolloClient } from "@apollo/client";

export function LibraryProvider({ children }: React.PropsWithChildren) {
    const client = useApolloClient();
    const contextValue = React.useMemo(() => ({ library: new Library(client) }), [client]);

    return <LibraryContext.Provider value={contextValue}>{children}</LibraryContext.Provider>;
}
