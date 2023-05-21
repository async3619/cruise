import React from "react";

import { useColorScheme } from "@mui/material";

import { AppTheme, Config, useConfigQuery, useUpdateConfigMutation } from "@queries";

export interface ConfigProviderProps {
    children: React.ReactNode;
}

interface ConfigContextValue {
    config: Config | null;
    setConfig: (config: Config) => void;
}

export const ConfigContext = React.createContext<ConfigContextValue>({
    setConfig: () => {},
    config: null,
});

export function useConfig() {
    return React.useContext(ConfigContext);
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }: ConfigProviderProps) => {
    const { setMode } = useColorScheme();
    const [config, setConfig] = React.useState<Config | null>(null);
    const handleChange = (config: Config) => {
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
    };

    const { data: initialConfig, loading } = useConfigQuery();
    const [updateConfig] = useUpdateConfigMutation();

    React.useEffect(() => {
        if (!initialConfig) {
            return;
        }

        handleChange(initialConfig.config);
    }, [initialConfig]);

    React.useEffect(() => {
        if (!config) {
            return;
        }

        const newConfig = { ...config };
        delete newConfig.__typename;

        updateConfig({
            variables: { config: newConfig },
        });
    }, [config]);

    if (!initialConfig || loading) {
        return null;
    }

    return <ConfigContext.Provider value={{ config, setConfig: handleChange }}>{children}</ConfigContext.Provider>;
};
