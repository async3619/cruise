import React from "react";

import { useColorScheme } from "@mui/material";
import { ConfigContext, ConfigContextValues } from "@components/Config";

import { ColorMode, ConfigUpdateInput, useConfigUpdatedSubscription, useUpdateConfigMutation } from "@graphql/queries";

import { ConfigData } from "@utils/types";
import { useTranslation } from "react-i18next";

export interface ConfigProviderProps {
    initialConfig: ConfigData;
}

export function ConfigProvider({ children, initialConfig }: React.PropsWithChildren<ConfigProviderProps>) {
    const { setMode } = useColorScheme();
    const [configData, setConfigData] = React.useState(initialConfig);
    const [updateConfig] = useUpdateConfigMutation();
    const { i18n } = useTranslation();

    useConfigUpdatedSubscription({
        onData: ({ data: { data } }) => {
            if (!data?.configUpdated) {
                return;
            }

            setConfigData(data.configUpdated);
        },
    });

    React.useEffect(() => {
        if (!configData) {
            return;
        }

        const { colorMode, language } = configData;
        switch (colorMode) {
            case ColorMode.System:
                setMode("system");
                break;

            case ColorMode.Light:
                setMode("light");
                break;

            case ColorMode.Dark:
                setMode("dark");
                break;
        }

        if (i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [configData, i18n, setMode]);

    const setConfig = React.useCallback(
        async (input: ConfigUpdateInput) => {
            await updateConfig({
                variables: {
                    data: {
                        colorMode: input.colorMode,
                        language: input.language,
                    },
                },
            });
        },
        [updateConfig],
    );

    const contextValue = React.useMemo<ConfigContextValues>(
        () => ({ config: configData, setConfig }),
        [configData, setConfig],
    );

    return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>;
}
