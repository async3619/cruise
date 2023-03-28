import React from "react";

import { Config, SelectOnly, ValueOf } from "@utils/types";

export interface BaseSettingsItem<TValueType extends null | ValueOf<Config>> {
    id: TValueType extends null ? string : keyof SelectOnly<Config, Exclude<TValueType, null>>;
    title: string;
    icon?: React.ComponentType;
    button?: {
        label: string;
        icon?: React.ComponentType;
    };
    __value_type?: TValueType;
}

export interface PathListSettingsItem extends BaseSettingsItem<string[]> {
    type: "path_list";
    pathType?: "directory" | "file";
}

export interface ButtonSettingsItem extends BaseSettingsItem<null> {
    type: "button";
    description?: React.ReactNode | (() => React.ReactNode);
}

export type SettingsItem = ButtonSettingsItem | PathListSettingsItem;
export type SettingsItemValue<TItem extends SettingsItem> = Exclude<TItem["__value_type"], undefined>;

export interface SettingsListItemProps<TItem extends SettingsItem> {
    item: TItem;
    value: SettingsItemValue<TItem>;
    onChange(item: TItem, newValue: SettingsItemValue<TItem>): void;
}
