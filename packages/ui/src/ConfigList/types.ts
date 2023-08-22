import React from "react";

export type BaseConfig = Record<string, unknown>;
export type KeyOf<T> = Exclude<keyof T, symbol | number>;

export interface BaseConfigListItem<TConfig extends BaseConfig> {
    name: KeyOf<TConfig>;
    label: string;
    icon?: React.ReactNode;
}

export interface SwitchConfigListItem<TConfig extends BaseConfig> extends BaseConfigListItem<TConfig> {
    type: "switch";
    labels: Record<string, string>;
}

export interface ActionConfigListItem<TConfig extends BaseConfig> extends Omit<BaseConfigListItem<TConfig>, "name"> {
    type: "action";
    action: () => void;
    description?: string;
    button: {
        label: string;
        disabled?: boolean;
    };
}

export type ConfigListItem<TConfig extends BaseConfig> = SwitchConfigListItem<TConfig> | ActionConfigListItem<TConfig>;

export interface BaseConfigListProps<TConfig extends BaseConfig, TListItem extends ConfigListItem<TConfig>> {
    item: TListItem;
    config: TConfig;
    setConfig: (config: TConfig) => void;
}
