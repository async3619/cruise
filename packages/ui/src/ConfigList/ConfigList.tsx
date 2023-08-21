import React from "react";

import { Stack } from "@mui/material";

import { SwitchConfigListItem } from "./SwitchItem";

import { Root } from "./ConfigList.styles";
import { BaseConfig, ConfigListItem } from "./types";

export interface ConfigListProps<TConfig extends BaseConfig> {
    config: TConfig;
    onChange: (config: TConfig) => void;
    items: ConfigListItem<TConfig>[];
}

export function ConfigList<TConfig extends BaseConfig>({ config, onChange, items }: ConfigListProps<TConfig>) {
    return (
        <Root data-testid="ConfigList">
            <Stack spacing={1}>
                {items.map(item => {
                    switch (item.type) {
                        case "switch":
                            return (
                                <SwitchConfigListItem
                                    key={item.name}
                                    item={item}
                                    config={config}
                                    setConfig={onChange}
                                />
                            );

                        default:
                            throw new Error(`Unknown config item type: ${item.type}`);
                    }
                })}
            </Stack>
        </Root>
    );
}
