import React from "react";

import { Page } from "@components/Page";

export interface SearchProps {}

export function Search({}: SearchProps) {
    return (
        <Page title="Search">
            <span>Search</span>
        </Page>
    );
}
