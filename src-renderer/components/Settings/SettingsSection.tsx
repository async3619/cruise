import React from "react";

import { Typography } from "@mui/material";

import SettingsList, { SettingsListProps } from "@components/Settings/SettingsList";
import { SettingsItem } from "@components/Settings/types";

import { Root } from "@components/Settings/SettingsSection.styles";

export interface SettingsSectionProps extends SettingsListProps {
    title: string;
    onButtonClick(item: SettingsItem): void;
}

export default function SettingsSection(props: SettingsSectionProps) {
    const { onChange, items, config, title, onButtonClick } = props;

    return (
        <Root>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <SettingsList items={items} config={config} onChange={onChange} onButtonClick={onButtonClick} />
        </Root>
    );
}
