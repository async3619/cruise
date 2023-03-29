import React from "react";

import { ApolloClient, OnDataOptions } from "@apollo/client";
import { RescanDocument, ScanningStateChangedComponent, ScanningStateChangedSubscription } from "@queries";

import { LoadingSnackbarInstance } from "@components/Dialogs";
import withDialog, { WithDialogProps } from "@components/Dialogs/withDialog";

import LibraryContext, { LibraryContextValue } from "@library/context";
import _ from "lodash";

export interface LibraryProviderProps extends WithDialogProps {
    children: React.ReactNode;
    client: ApolloClient<object>;
}
export interface LibraryProviderStates {}

class LibraryProvider extends React.Component<LibraryProviderProps, LibraryProviderStates> {
    private readonly contextValue: LibraryContextValue;
    private scanningSnackbar: LoadingSnackbarInstance | null = null;

    public constructor(props: LibraryProviderProps) {
        super(props);

        this.contextValue = {
            scan: this.scan.bind(this),
        };
    }

    private handleScanningStateChanged = async ({
        data: { data },
    }: OnDataOptions<ScanningStateChangedSubscription>) => {
        if (!data) {
            return;
        }

        if (data.scanningStateChanged) {
            if (!!this.scanningSnackbar) {
                return;
            }

            this.scanningSnackbar = await this.props.pushSnackbar({
                type: "loading",
                message: "Scanning library...",
            });
        } else if (this.scanningSnackbar) {
            try {
                this.scanningSnackbar.success("Library scanned successfully");
            } catch {
                await this.props.pushSnackbar({
                    type: "success",
                    message: "Library scanned successfully",
                });
            }
        } else {
            await this.props.pushSnackbar({
                type: "success",
                message: "Library scanned successfully",
            });
        }
    };

    private scan = async () => {
        await this.props.client.mutate({
            mutation: RescanDocument,
        });
    };

    public render() {
        return (
            <>
                <ScanningStateChangedComponent onData={this.handleScanningStateChanged} />
                <LibraryContext.Provider value={this.contextValue}>{this.props.children}</LibraryContext.Provider>
            </>
        );
    }
}

export default withDialog(LibraryProvider);
