import React from "react";
import { useTranslation } from "react-i18next";

import { useColorScheme } from "@mui/material";

import {
    AppTheme,
    Config,
    Language,
    useAvailableLanguagesQuery,
    useConfigQuery,
    useUpdateConfigMutation,
} from "@queries";
import _ from "lodash";

export interface ConfigProviderProps {
    children: React.ReactNode;
}

export interface ConfigContextValue {
    config: Config;
    setConfig: (config: Partial<Config>) => void;
    languages: Language[];
    languageMap: Record<string, string>;
}

export const ConfigContext = React.createContext<ConfigContextValue>({
    setConfig: () => {
        throw new Error("ConfigProvider not initialized");
    },
    config: {} as any,
    languages: [],
    languageMap: {},
});

export function useConfig() {
    return React.useContext(ConfigContext);
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }: ConfigProviderProps) => {
    const { setMode } = useColorScheme();
    const [config, setConfig] = React.useState<Config | null>(null);
    const { data: initialConfig, loading } = useConfigQuery();
    const [languages, setLanguages] = React.useState<Language[]>([]);
    const [languageMap, setLanguageMap] = React.useState<Record<string, string>>({});
    const [updateConfig] = useUpdateConfigMutation();
    const languagesQuery = useAvailableLanguagesQuery();
    const { i18n } = useTranslation();

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

    React.useEffect(() => {
        const { data, loading } = languagesQuery;
        if (!data || loading) {
            return;
        }

        setLanguages(data.availableLanguages);
        setLanguageMap(_.chain(data.availableLanguages).keyBy("code").mapValues("name").value());
    }, [languagesQuery]);

    React.useEffect(() => {
        if (!config?.language) {
            return;
        }

        i18n.changeLanguage(config.language);
    }, [config?.language, i18n]);

    if (!config || loading) {
        return null;
    }

    return (
        <ConfigContext.Provider value={{ config, setConfig: setConfigValue, languages, languageMap }}>
            {children}
        </ConfigContext.Provider>
    );
};
