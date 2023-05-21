import React from "react";

import { Config } from "@queries";
import { ConfigPanelProps } from "@components/Config/Panel/Base";
import { PathListConfigPanel } from "@components/Config/Panel/PathList";
import { EnumConfigPanel } from "@components/Config/Panel/Enum";
import { ActionConfigPanel } from "@components/Config/Panel/Action";

export type ConfigFieldName = keyof Omit<Config, "__typename">;

export type PickOnly<T, TItem> = {
    [K in keyof T]: T[K] extends TItem ? K : never;
};

export interface ConfigPanelActionToolbar {
    type: "action";
    label: string;
    icon?: React.ComponentType;
    onClick: () => void;
}

export interface ConfigPanelLabelToolbar {
    type: "label";
    label: string;
}

export type ConfigPanelToolbar = ConfigPanelActionToolbar | ConfigPanelLabelToolbar;

export interface BaseConfigItem<TValue> {
    __value: TValue;
    label: string;
    icon?: React.ComponentType;
    description?: string;
}

export interface EnumConfigItem<TEnum extends Record<string, string>> extends BaseConfigItem<TEnum> {
    type: "enum";
    enum: TEnum;
    enumLabels: Record<keyof TEnum, string>;
    name: keyof PickOnly<Omit<Config, "__typename">, TEnum>;
}

export interface PathListConfigItem extends BaseConfigItem<string[]> {
    type: "path-list";
    pathType: "file" | "directory";
    name: keyof PickOnly<Omit<Config, "__typename">, string>;
    actionLabel?: string;
}

export interface ActionConfigItem extends BaseConfigItem<void> {
    type: "action";
    name: string;
    action: ConfigPanelActionToolbar;
}

export type ConfigItem = EnumConfigItem<any> | PathListConfigItem | ActionConfigItem;

export function createEnumConfigItem<TEnum extends Record<string, string>>(
    item: Omit<EnumConfigItem<TEnum>, "__value">,
): EnumConfigItem<TEnum> {
    return item as EnumConfigItem<TEnum>;
}

export function createConfigItem(
    item: Omit<Exclude<ConfigItem, EnumConfigItem<any> | ActionConfigItem>, "__value">,
): ConfigItem {
    return item as ConfigItem;
}

export function createActionConfigItem(item: Omit<ActionConfigItem, "__value">): ActionConfigItem {
    return item as ActionConfigItem;
}

export type ConfigPanelMap = {
    [Type in ConfigItem["type"]]: React.ComponentType<ConfigPanelProps<Extract<ConfigItem, { type: Type }>>>;
};

export const ConfigPanelMap: ConfigPanelMap = {
    "path-list": PathListConfigPanel,
    enum: EnumConfigPanel,
    action: ActionConfigPanel,
};
