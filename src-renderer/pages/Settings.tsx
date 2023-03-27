import React from "react";

import Page from "@components/Page";
import SettingsSection from "@components/Settings/SettingsSection";
import { SettingsItem } from "@components/Settings/types";

import { LIBRARY_SETTINGS_ITEMS } from "@constants/settings";

import { Config } from "@main/config";
import { client } from "@/api";

import useLibrary from "@library/useLibrary";

import { Root } from "@pages/Settings.styles";

export default function Settings() {
    const [config, setConfig] = React.useState<Config | null>(null);
    const library = useLibrary();

    React.useEffect(() => {
        client.getConfig.query().then(setConfig);
    }, []);

    const handleChange = (config: Config) => {
        client.setConfig.mutate(config).then(setConfig);
    };

    const handleButtonClick = async (item: SettingsItem) => {
        switch (item.id) {
            case "rescanLibrary":
                await library.scan();
                break;
        }
    };

    return (
        <Page title="Settings">
            <Root>
                {config && (
                    <SettingsSection
                        onButtonClick={handleButtonClick}
                        onChange={handleChange}
                        title="Library"
                        config={config}
                        items={LIBRARY_SETTINGS_ITEMS}
                    />
                )}
            </Root>
        </Page>
    );
}
