import React from "react";
import { animated, useTransition } from "@react-spring/web";

import { useTheme } from "@mui/material";

import { Toast } from "./Toast";
import { useToastQueue } from "./Provider";

import { Content, Root } from "./Container.styles";

export interface ToastContainerProps {
    config?: {
        tension: number;
        friction: number;
        precision: number;
    };
}

export function ToastContainer({ config = { tension: 125, friction: 20, precision: 0.1 } }: ToastContainerProps) {
    const toastQueue = useToastQueue();
    const theme = useTheme();
    const refMap = React.useMemo(() => new WeakMap(), []);
    const cancelMap = React.useMemo(() => new WeakMap(), []);

    const transitions = useTransition(toastQueue, {
        from: { opacity: 0, height: 0, life: "100%" },
        keys: item => item.id,
        enter: item => async (next, cancel) => {
            cancelMap.set(item, cancel);
            await next({ opacity: 1, height: refMap.get(item).offsetHeight });
            await next({ life: "0%" });
        },
        leave: [{ opacity: 0, height: 0 }],
        config: (_, __, phase) => key =>
            phase === "enter" && key === "life" ? { duration: theme.transitions.duration.standard } : config,
    });

    return (
        <Root>
            {transitions((style, item) => (
                <animated.div style={{ ...style, pointerEvents: "auto" }}>
                    <Content ref={ref => ref && refMap.set(item, ref)}>
                        <Toast item={item} />
                    </Content>
                </animated.div>
            ))}
        </Root>
    );
}
