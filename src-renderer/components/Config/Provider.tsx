import React from "react";

import { useColorScheme } from "@mui/material";

import { AppTheme, Config, useConfigQuery, useUpdateConfigMutation } from "@queries";

export interface ConfigProviderProps {
    children: React.ReactNode;
}

export interface ConfigContextValue {
    config: Config;
    setConfig: (config: Partial<Config>) => void;
}

export const ConfigContext = React.createContext<ConfigContextValue>({
    setConfig: () => {
        throw new Error("ConfigProvider not initialized");
    },
    config: {} as any,
});

export function useConfig() {
    return React.useContext(ConfigContext);
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }: ConfigProviderProps) => {
    const { setMode } = useColorScheme();
    const [config, setConfig] = React.useState<Config | null>(null);
    const { data: initialConfig, loading } = useConfigQuery();
    const [updateConfig] = useUpdateConfigMutation();

    const handleChange = React.useCallback(
        (config: Config) => {
            switch (config.appTheme) {
                case AppTheme.Light:
                    setMode("light");
                    break;

                case AppTheme.Dark:
                    setMode("dark");
                    break;

                case AppTheme.System:
                    setMode("system");
                    break;
            }

            setConfig(config);
        },
        [setMode],
    );

    const setConfigValue = React.useCallback(
        (partialConfig: Partial<Config>) => {
            if (!config) {
                return;
            }

            handleChange({ ...config, ...partialConfig });
        },
        [config, handleChange],
    );

    React.useEffect(() => {
        if (!initialConfig) {
            return;
        }

        handleChange(initialConfig.config);
    }, [initialConfig, handleChange]);

    React.useEffect(() => {
        if (!config) {
            return;
        }

        const newConfig = { ...config };
        delete newConfig.__typename;

        updateConfig({
            variables: { config: newConfig },
        });
    }, [config, updateConfig]);

    if (!config || loading) {
        return null;
    }

    return <ConfigContext.Provider value={{ config, setConfig: setConfigValue }}>{children}</ConfigContext.Provider>;
};
