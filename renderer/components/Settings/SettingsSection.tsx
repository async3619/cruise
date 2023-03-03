import React from "react";

import { Typography } from "@mui/material";

import SettingsList, { SettingsListProps } from "@components/Settings/SettingsList";

import { Root } from "@components/Settings/SettingsSection.styles";

export interface SettingsSectionProps extends SettingsListProps {
    title: string;
}

export default function SettingsSection(props: SettingsSectionProps) {
    const { onChange, items, config, title } = props;

    return (
        <Root>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <SettingsList items={items} config={config} onChange={onChange} />
        </Root>
    );
}
