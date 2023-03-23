import React from "react";

import { LayoutContext } from "@components/Layout/context";

export function useLayout() {
    return React.useContext(LayoutContext);
}
