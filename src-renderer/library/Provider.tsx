import React from "react";

import { ApolloClient } from "@apollo/client";
import { RescanDocument } from "@queries";

import withDialog, { WithDialogProps } from "@components/Dialogs/withDialog";

import LibraryContext, { LibraryContextValue } from "@library/context";

export interface LibraryProviderProps extends WithDialogProps {
    children: React.ReactNode;
    client: ApolloClient<object>;
}
export interface LibraryProviderStates {}

class LibraryProvider extends React.Component<LibraryProviderProps, LibraryProviderStates> {
    private readonly contextValue: LibraryContextValue;

    public constructor(props: LibraryProviderProps) {
        super(props);

        this.contextValue = {
            scan: this.scan.bind(this),
        };
    }

    private scan = async () => {
        const instance = await this.props.pushSnackbar({
            type: "loading",
            message: "Scanning library...",
        });

        try {
            await this.props.client.mutate({
                mutation: RescanDocument,
            });

            instance.success("Library scan completed");
        } catch (e) {
            if (!(e instanceof Error)) {
                throw e;
            }

            instance.error(`Library scan failed: ${e.message}`);
            throw e;
        }
    };

    public render() {
        return <LibraryContext.Provider value={this.contextValue}>{this.props.children}</LibraryContext.Provider>;
    }
}

export default withDialog(LibraryProvider);
