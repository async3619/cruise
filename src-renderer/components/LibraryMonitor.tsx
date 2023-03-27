import React from "react";

import { LoadingSnackbarInstance } from "@dialogs";
import withDialog, { WithDialogProps } from "@dialogs/withDialog";

import { OnDataOptions } from "@apollo/client";
import { ScanningStateChangedComponent, ScanningStateChangedSubscription } from "@queries";

export interface LibraryMonitorProps extends WithDialogProps {}
export interface LibraryMonitorStates {
    scanning: boolean;
}

class LibraryMonitor extends React.Component<LibraryMonitorProps, LibraryMonitorStates> {
    private scanningSnackbarInstance: LoadingSnackbarInstance | null = null;
    public state: LibraryMonitorStates = {
        scanning: false,
    };

    private handleScanningStateChange = async ({ data: { data } }: OnDataOptions<ScanningStateChangedSubscription>) => {
        if (!data) {
            return;
        }

        if (data.scanningStateChanged) {
            this.scanningSnackbarInstance = await this.props.pushSnackbar({
                type: "loading",
                message: "Scanning library...",
            });
        } else {
            if (this.scanningSnackbarInstance) {
                this.scanningSnackbarInstance.success("Library scan completed");
                this.scanningSnackbarInstance = null;
            }
        }

        this.setState({
            scanning: data.scanningStateChanged,
        });
    };

    public render() {
        return <ScanningStateChangedComponent onData={this.handleScanningStateChange} />;
    }
}

export default withDialog(LibraryMonitor);
