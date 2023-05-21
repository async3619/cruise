import React from "react";

import { Stack, Typography } from "@mui/material";

import { ConfigFieldName, ConfigItem, ConfigPanelMap } from "@components/Config";
import { Root } from "@components/Config/Group.styles";

import { Config } from "@queries";

import { noop } from "@utils/noop";

export interface ConfigGroupProps {
    title?: string;
    items: ConfigItem[];
    value: Config;
    onChange<TKey extends ConfigFieldName>(key: TKey, value: Config[TKey]): void;
}

export function ConfigGroup({ items, onChange, title, value }: ConfigGroupProps) {
    return (
        <Root>
            {title && (
                <Typography variant="body1" sx={{ mb: 1 }} fontWeight={400}>
                    {title}
                </Typography>
            )}
            <Stack spacing={1}>
                {items.map(item => {
                    if (item.type === "action") {
                        const ActionComponent = ConfigPanelMap[item.type];

                        return <ActionComponent item={item} value={null as any} onChange={noop} key={item.name} />;
                    }

                    const Component = ConfigPanelMap[item.type];

                    return (
                        <Component
                            key={item.name}
                            value={value[item.name] as React.ComponentProps<typeof Component>["value"]}
                            onChange={value => onChange(item.name, value)}
                            item={item as never}
                        />
                    );
                })}
            </Stack>
        </Root>
    );
}
