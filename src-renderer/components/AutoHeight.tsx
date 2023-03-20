import React from "react";
import useMeasure from "react-use-measure";

import { Root } from "./AutoHeight.styles";

export interface AutoHeightProps {
    children: (height: number) => React.ReactNode;
}

export default function AutoHeight({ children }: AutoHeightProps) {
    const [ref, bounds] = useMeasure();

    return <Root ref={ref}>{children(bounds.height)}</Root>;
}
