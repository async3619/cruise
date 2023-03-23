import React from "react";

import { ReactComponent as CloseIcon } from "@res/close.svg";
import { ReactComponent as MaximizeIcon } from "@res/maximize.svg";
import { ReactComponent as RestoreIcon } from "@res/restore.svg";

import { Button, MinimizeIcon, Root } from "@components/WindowControl.styles";

import { client } from "@/api";

export default function WindowControl() {
    const [maximized, setMaximized] = React.useState(false);

    React.useEffect(() => {
        const subscriber = client.onMaximizedStateChange.subscribe(undefined, {
            onData: setMaximized,
            onError: e => {
                console.error(e);
            },
        });

        return () => {
            subscriber.unsubscribe();
        };
    }, []);

    const handleMinimize = () => {
        client.minimize.query().then();
    };
    const handleMaximize = () => {
        client.toggleMaximize.query().then();
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
