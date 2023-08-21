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

export type ConfigListItem<TConfig extends BaseConfig> = SwitchConfigListItem<TConfig>;

export interface BaseConfigListProps<TConfig extends BaseConfig, TListItem extends BaseConfigListItem<TConfig>> {
    item: TListItem;
    config: TConfig;
    setConfig: (config: TConfig) => void;
}
