import React from "react";

import { Box, CircularProgress } from "@mui/material";

import Page from "@components/Page";
import SettingsSection from "@components/Settings/SettingsSection";
import { SettingsItem } from "@components/Settings/types";

import { useConfigQuery, useUpdateConfigMutation } from "@queries";

import { LIBRARY_SETTINGS_ITEMS } from "@constants/settings";

import { Root } from "@pages/Settings.styles";
import { BasePageProps, Config } from "@utils/types";

export default function Settings({ library }: BasePageProps) {
    const [config, setConfig] = React.useState<Config | null>(null);
    const { data, refetch } = useConfigQuery();
    const [updateConfig] = useUpdateConfigMutation();

    React.useEffect(() => {
        if (!data) {
            return;
        }

        setConfig(data.config);
    }, [data]);

    const handleChange = async (config: Config) => {
        await updateConfig({
            variables: {
                config: {
                    libraryDirectories: config.libraryDirectories,
                },
            },
        });

        await refetch();
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
                {!config && (
                    <Box py={2} display="flex" justifyContent="center">
                        <CircularProgress size={36} />
                    </Box>
                )}
            </Root>
        </Page>
    );
}
