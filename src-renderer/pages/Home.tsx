import React from "react";

import { Page } from "@components/Page";

export interface HomeProps {}

export function Home({}: HomeProps) {
    return (
        <Page title="Home">
            <span>Home</span>
        </Page>
    );
}
