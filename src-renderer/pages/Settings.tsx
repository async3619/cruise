import React from "react";

import { Page } from "@components/Page";

export interface SettingsProps {}

export function Settings({}: SettingsProps) {
    return (
        <Page title="Settings">
            <span>Settings</span>
        </Page>
    );
}
