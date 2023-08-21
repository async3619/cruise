import React from "react";

import { ConfigUpdateInput } from "@graphql/queries";

import { ConfigData } from "@utils/types";

export interface ConfigContextValues {
    config: ConfigData;
    setConfig: (config: ConfigUpdateInput) => void;
}

export const ConfigContext = React.createContext<ConfigContextValues | null>(null);

export function useConfig() {
    const context = React.useContext(ConfigContext);
    if (context === null) {
        throw new Error("useConfig must be used within a <ConfigProvider />");
    }

    return context;
}
