import React from "react";

import ButtonSettingsListItem from "@components/Settings/ListItem/Button";
import PathListSettingsListItem from "@components/Settings/ListItem/PathList";
import { SettingsItem, SettingsItemValue, SettingsListItemProps } from "@components/Settings/types";

type ComponentMap = {
    [TKey in SettingsItem["type"]]: React.ComponentType<SettingsListItemProps<Extract<SettingsItem, { type: TKey }>>>;
};

export const SETTINGS_COMPONENT_MAP: ComponentMap = {
    button: ButtonSettingsListItem,
    path_list: PathListSettingsListItem,
};

export function getSettingsComponent<TItem extends SettingsItem>(
    item: TItem,
): React.ComponentClass<SettingsListItemProps<TItem>> {
    return SETTINGS_COMPONENT_MAP[item.type] as unknown as React.ComponentClass<SettingsListItemProps<TItem>>;
}

export function renderSettingsListItem<TItem extends SettingsItem>(
    item: TItem,
    value: SettingsItemValue<TItem>,
    onChange: (item: TItem, newValue: SettingsItemValue<TItem>) => void,
) {
    const Component = getSettingsComponent(item);

    return <Component key={item.id} item={item} value={value} onChange={onChange} />;
}
