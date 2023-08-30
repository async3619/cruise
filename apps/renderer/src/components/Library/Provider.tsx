import { useDialog, useToast } from "ui";

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
    const toast = useToast();
    const dialog = useDialog();
    const contextValue = React.useMemo(
        () => ({ library: new Library(client, t, navigator, toast, dialog) }),
        [client, dialog, navigator, t, toast],
    );

    return <LibraryContext.Provider value={contextValue}>{children}</LibraryContext.Provider>;
}
