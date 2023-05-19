import React from "react";

import { Root } from "./Library.styles";

export interface LibraryProps {}

export function Library({}: LibraryProps) {
    return (
        <Root>
            <span>Library</span>
        </Root>
    );
}
