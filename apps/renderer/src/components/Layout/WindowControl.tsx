import React from "react";
import { WindowControlButton } from "ui";

import { Stack } from "@mui/material";

import {
    useCloseWindowMutation,
    useIsMaximizedQuery,
    useMaximizedStateChangedSubscription,
    useMaximizeWindowMutation,
    useMinimizeWindowMutation,
    useUnmaximizeWindowMutation,
} from "@graphql/queries";

export interface WindowControlProps {}

export function WindowControl({}: WindowControlProps) {
    const [isMaximized, setIsMaximized] = React.useState(false);
    const { data, loading } = useIsMaximizedQuery();
    const [minimize] = useMinimizeWindowMutation();
    const [maximize] = useMaximizeWindowMutation();
    const [unmaximize] = useUnmaximizeWindowMutation();
    const [close] = useCloseWindowMutation();

    useMaximizedStateChangedSubscription({
        onData: ({ data: { data } }) => {
            if (!data) return;

            setIsMaximized(data.maximizedStateChanged);
        },
    });

    React.useEffect(() => {
        if (loading || !data) return;

        setIsMaximized(data.isMaximized);
    }, [data, loading]);

    return (
        <Stack direction="row">
            <WindowControlButton type="minimize" onClick={() => minimize()} />
            <WindowControlButton type="maximize" onClick={() => (isMaximized ? unmaximize() : maximize())} />
            <WindowControlButton type="close" onClick={() => close()} />
        </Stack>
    );
}
