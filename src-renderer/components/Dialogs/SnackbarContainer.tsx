import React from "react";
import { useTransition } from "react-spring";

import { useTheme } from "@mui/material";

import { SnackbarGlobalOptions, SnackbarItem } from "@dialogs";
import Snackbar from "@dialogs/Snackbar";

import { Content, Item, Root } from "@dialogs/SnackbarContainer.styles";

export interface SnackbarContainerProps {
    items: SnackbarItem[];
    globalOptions?: SnackbarGlobalOptions;
    config?: {
        tension: number;
        friction: number;
        precision: number;
    };
    requestClose(item: SnackbarItem): void;
}

export default function SnackbarContainer({
    items,
    globalOptions = {},
    config = { tension: 125, friction: 20, precision: 0.1 },
    requestClose,
}: SnackbarContainerProps) {
    const theme = useTheme();
    const refMap = React.useMemo(() => new WeakMap(), []);
    const cancelMap = React.useMemo(() => new WeakMap(), []);

    const transitions = useTransition(items, {
        from: { opacity: 0, height: 0, life: "100%" },
        keys: item => item.id,
        enter: item => async (next, cancel) => {
            cancelMap.set(item, cancel);
            await next({ opacity: 1, height: refMap.get(item).offsetHeight });
            await next({ life: "0%" });
        },
        leave: [{ opacity: 0 }, { height: 0 }],
        config: (item, index, phase) => key =>
            phase === "enter" && key === "life" ? { duration: theme.transitions.duration.standard } : config,
    });

    return (
        <Root>
            {transitions((style, item) => (
                <Item style={style}>
                    <Content ref={ref => ref && refMap.set(item, ref)}>
                        <Snackbar requestClose={requestClose} item={item} globalOptions={globalOptions} />
                    </Content>
                </Item>
            ))}
        </Root>
    );
}
