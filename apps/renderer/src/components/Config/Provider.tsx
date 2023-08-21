import React from "react";

import { useColorScheme } from "@mui/material";
import { ConfigContext, ConfigContextValues } from "@components/Config";

import { ColorMode, ConfigUpdateInput, useConfigUpdatedSubscription, useUpdateConfigMutation } from "@graphql/queries";

import { ConfigData } from "@utils/types";

export interface ConfigProviderProps {
    initialConfig: ConfigData;
}

export function ConfigProvider({ children, initialConfig }: React.PropsWithChildren<ConfigProviderProps>) {
    const { setMode } = useColorScheme();
    const [configData, setConfigData] = React.useState(initialConfig);
    const [updateConfig] = useUpdateConfigMutation();

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

        const { colorMode } = configData;
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
    }, [configData, setMode]);

    const setConfig = React.useCallback(
        async (input: ConfigUpdateInput) => {
            const data = { ...input };
            if ("__typename" in data) {
                delete data.__typename;
            }

            await updateConfig({ variables: { data } });
        },
        [updateConfig],
    );

    const contextValue = React.useMemo<ConfigContextValues>(
        () => ({ config: configData, setConfig }),
        [configData, setConfig],
    );

    return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>;
}
