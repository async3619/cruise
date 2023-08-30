import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Library } from "@components/Library";
import { LibraryContext } from "@components/Library/context";

import { useApolloClient } from "@apollo/client";

export function LibraryProvider({ children }: React.PropsWithChildren) {
    const client = useApolloClient();
    const { t } = useTranslation();
    const navigator = useNavigate();
    const contextValue = React.useMemo(() => ({ library: new Library(client, t, navigator) }), [client, navigator, t]);

    return <LibraryContext.Provider value={contextValue}>{children}</LibraryContext.Provider>;
}
