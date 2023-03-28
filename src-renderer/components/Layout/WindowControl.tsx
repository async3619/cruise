import React from "react";

import { OnDataOptions } from "@apollo/client";
import { withApollo, WithApolloClient } from "@apollo/client/react/hoc";
import {
    CloseDocument,
    MaximizeDocument,
    MaximizedStateChangedComponent,
    MaximizedStateChangedSubscription,
    MinimizeDocument,
} from "@queries";

import { ReactComponent as CloseIcon } from "@res/close.svg";
import { ReactComponent as MaximizeIcon } from "@res/maximize.svg";
import { ReactComponent as RestoreIcon } from "@res/restore.svg";

import { Button, MinimizeIcon, Root } from "@components/Layout/WindowControl.styles";

export interface WindowControlProps {}
export interface WindowControlStates {
    maximized: boolean;
}

class WindowControl extends React.Component<WithApolloClient<WindowControlProps>, WindowControlStates> {
    public state: WindowControlStates = {
        maximized: false,
    };

    private handleMinimize = async () => {
        if (!this.props.client) {
            throw new Error("Apollo client is not available");
        }

        await this.props.client.mutate({
            mutation: MinimizeDocument,
        });
    };
    private handleMaximize = async () => {
        if (!this.props.client) {
            throw new Error("Apollo client is not available");
        }

        await this.props.client.mutate({
            mutation: MaximizeDocument,
        });
    };
    private handleClose = async () => {
        if (!this.props.client) {
            throw new Error("Apollo client is not available");
        }

        await this.props.client.mutate({
            mutation: CloseDocument,
        });
    };

    private handleMaximizedStateChanged = ({ data: { data } }: OnDataOptions<MaximizedStateChangedSubscription>) => {
        if (!data) {
            return;
        }

        this.setState({ maximized: data.maximizedStateChanged });
    };

    public render() {
        const { maximized } = this.state;

        return (
            <>
                <MaximizedStateChangedComponent onData={this.handleMaximizedStateChanged} />
                <Root>
                    <Button onClick={this.handleMinimize}>
                        <MinimizeIcon />
                    </Button>
                    <Button onClick={this.handleMaximize}>{maximized ? <RestoreIcon /> : <MaximizeIcon />}</Button>
                    <Button close onClick={this.handleClose}>
                        <CloseIcon />
                    </Button>
                </Root>
            </>
        );
    }
}

export default withApollo(WindowControl);
