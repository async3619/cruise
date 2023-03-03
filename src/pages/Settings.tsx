import React from "react";

import Page from "@components/Page";

import { LIBRARY_SETTINGS_ITEMS } from "@constants/settings";

import type { Config } from "@main/config";

import { Root } from "@pages/Settings.styles";
import SettingsSection from "@components/Settings/SettingsSection";
import { client } from "@/api";

export interface SettingsProps {}
export interface SettingsStates {
    config: Config | null;
}

export default class Settings extends React.Component<SettingsProps, SettingsStates> {
    public state: SettingsStates = {
        config: null,
    };

    public componentDidMount() {
        client.getConfig.query().then(config => {
            this.setState({ config });
        });
    }

    private handleChange = (config: Config) => {
        client.setConfig.mutate(config);
        this.setState({ config });
    };

    public render() {
        const { config } = this.state;

        return (
            <Page title="Settings">
                <Root>
                    {config && (
                        <>
                            <SettingsSection
                                title="Library"
                                config={config}
                                onChange={this.handleChange}
                                items={LIBRARY_SETTINGS_ITEMS}
                            />
                        </>
                    )}
                </Root>
            </Page>
        );
    }
}
