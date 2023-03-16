import React from "react";

import StringList from "@components/UI/StringList";

import BaseSettingsListItem from "@components/Settings/ListItem/Base";
import { PathListSettingsItem, SettingsListItemProps } from "@components/Settings/types";

import { client } from "@/api";

export interface PathListSettingsListItemProps extends SettingsListItemProps<PathListSettingsItem> {}
export interface PathListSettingsListItemStates {}

export default class PathListSettingsListItem extends React.Component<
    PathListSettingsListItemProps,
    PathListSettingsListItemStates
> {
    private handleChange = (items: string[]) => {
        this.props.onChange(this.props.item, items);
    };

    private handleAddPathClick = async () => {
        const { item, value, onChange } = this.props;
        const targetPath = await client.selectPath.query({
            directory: true,
            multiple: true,
        });

        if (!targetPath || targetPath.length === 0) {
            return;
        }

        let newValues = value;
        if (Array.isArray(targetPath)) {
            newValues = [...newValues, ...targetPath];
        } else {
            newValues = [...newValues, targetPath];
        }

        onChange(item, newValues);
    };

    public render() {
        const { item, value } = this.props;

        return (
            <BaseSettingsListItem item={item} onButtonClick={this.handleAddPathClick}>
                <StringList items={value} onChange={this.handleChange} />
            </BaseSettingsListItem>
        );
    }
}
