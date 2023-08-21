import React from "react";

import { useColorScheme } from "@mui/material";
import { ConfigContext, ConfigContextValues } from "@components/Config";

import {
    ColorMode,
    ConfigUpdateInput,
    useConfigQuery,
    useConfigUpdatedSubscription,
    useUpdateConfigMutation,
} from "@graphql/queries";

export interface ConfigProviderProps {}

export function ConfigProvider({ children }: React.PropsWithChildren<ConfigProviderProps>) {
    const { data } = useConfigQuery();
    const { setMode } = useColorScheme();
    const [configData, setConfigData] = React.useState(data?.config ?? null);
    const [updateConfig] = useUpdateConfigMutation();

    useConfigUpdatedSubscription({
        onData: ({ data: { data } }) => {
            setConfigData(data?.configUpdated ?? null);
        },
    });

    React.useEffect(() => {
        setConfigData(data?.config ?? null);
    }, [data?.config]);

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
