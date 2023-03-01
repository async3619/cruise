import React from "react";

import { renderSettingsListItem } from "@components/Settings/ListItem";
import { SettingsItem } from "@components/Settings/types";

import { Root } from "@components/Settings/SettingsList.styles";
import { ValueOf } from "@utils/types";
import { Config } from "@commands";

export interface SettingsListProps {
    items: SettingsItem[];
    config: Config;
    onChange(config: Config): void;
}
export interface SettingsListStates {}

export default class SettingsList extends React.Component<SettingsListProps, SettingsListStates> {
    private handleChange = (item: SettingsItem, value: ValueOf<Config> | null) => {
        if (value === null) {
            return;
        }

        this.props.onChange({
            ...this.props.config,
            [item.id]: value,
        });
    };

    public renderItem = (item: SettingsItem) => {
        if (item.type === "button") {
            return renderSettingsListItem(item, null, this.handleChange);
        }

        return renderSettingsListItem(item, this.props.config[item.id], this.handleChange);
    };

    public render() {
        const { items } = this.props;

        return <Root>{items.map(this.renderItem)}</Root>;
    }
}
