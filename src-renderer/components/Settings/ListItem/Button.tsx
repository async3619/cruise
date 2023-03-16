import React from "react";

import BaseSettingsListItem from "@components/Settings/ListItem/Base";

import { ButtonSettingsItem, SettingsListItemProps } from "@components/Settings/types";

export default class ButtonSettingsListItem extends React.Component<SettingsListItemProps<ButtonSettingsItem>> {
    public render() {
        const { item } = this.props;
        const { description } = item;

        let descriptionNode: React.ReactNode;
        if (typeof description === "function") {
            descriptionNode = description();
        } else if (typeof description === "string") {
            descriptionNode = description;
        } else if (description) {
            descriptionNode = description;
        }

        return <BaseSettingsListItem item={item}>{descriptionNode}</BaseSettingsListItem>;
    }
}
