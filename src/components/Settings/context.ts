import React from "react";
import { SettingsListProps } from "@components/Settings/SettingsList";

export interface SettingsContextValues {
    onButtonClick: SettingsListProps["onButtonClick"];
}

const SettingsContext = React.createContext<SettingsContextValues>(null as unknown as SettingsContextValues);

export function useSettings() {
    return React.useContext(SettingsContext);
}

export default SettingsContext;
