import React from "react";

import Page from "@components/Page";

import { LIBRARY_SETTINGS_ITEMS } from "@constants/settings";

import { Config, getConfig, setConfig } from "@commands";

import { Root } from "@pages/Settings.styles";
import SettingsSection from "@components/Settings/SettingsSection";

export interface SettingsProps {}
export interface SettingsStates {
    config: Config | null;
}

export default class Settings extends React.Component<SettingsProps, SettingsStates> {
    public state: SettingsStates = {
        config: null,
    };

    public componentDidMount() {
        getConfig().then(config => {
            this.setState({ config });
        });
    }

    private handleChange = (config: Config) => {
        setConfig(config).then(cfg => {
            this.setState({ config: cfg });
        });
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
