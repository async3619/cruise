import React from "react";

import { Dismiss24Regular, MaximizeRegular, SquareMultiple20Regular } from "@fluentui/react-icons";

import { Button, MinimizeIcon, Root } from "@components/WindowControl.styles";

import { client, trpcReact } from "@/api";

export default function WindowControl() {
    const [maximized, setMaximized] = React.useState(false);

    trpcReact.onMaximizedStateChange.useSubscription(undefined, {
        onData: setMaximized,
    });

    const handleMinimize = () => {
        client.minimize.query().then();
    };
    const handleMaximize = () => {
        if (maximized) {
            client.minimize.query().then();
        } else {
            client.maximize.query().then();
        }
    };
    const handleClose = () => {
        client.close.query().then();
    };

    return (
        <Root>
            <Button onClick={handleMinimize}>
                <MinimizeIcon />
            </Button>
            <Button onClick={handleMaximize}>{maximized ? <SquareMultiple20Regular /> : <MaximizeRegular />}</Button>
            <Button close onClick={handleClose}>
                <Dismiss24Regular />
            </Button>
        </Root>
    );
}
