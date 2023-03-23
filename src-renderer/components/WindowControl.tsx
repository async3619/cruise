import React from "react";

import { ReactComponent as CloseIcon } from "@res/close.svg";
import { ReactComponent as MaximizeIcon } from "@res/maximize.svg";
import { ReactComponent as RestoreIcon } from "@res/restore.svg";

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
            <Button onClick={handleMaximize}>{maximized ? <RestoreIcon /> : <MaximizeIcon />}</Button>
            <Button close onClick={handleClose}>
                <CloseIcon />
            </Button>
        </Root>
    );
}
