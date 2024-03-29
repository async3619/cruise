import React from "react";

import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

import { BaseConfigListItem, TextHelperOption } from "./BaseItem";
import { Root } from "./SwitchItem.styles";

import { BaseConfig, BaseConfigListProps, SwitchConfigListItem as ItemType } from "./types";

export interface SwitchConfigListItemProps<TConfig extends BaseConfig>
    extends BaseConfigListProps<TConfig, ItemType<TConfig>> {}

export function SwitchConfigListItem<TConfig extends BaseConfig>({
    item,
    config,
    setConfig,
}: SwitchConfigListItemProps<TConfig>) {
    const { name, labels } = item;
    const labelItems = Object.entries(labels);
    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value as TConfig[typeof name];
            setConfig({ ...config, [name]: value });
        },
        [config, name, setConfig],
    );

    const selectedItem = labelItems.find(([_, value]) => value === config[name]);
    let helperOption: TextHelperOption | undefined;
    if (selectedItem) {
        helperOption = { type: "text", text: selectedItem[0] };
    }

    return (
        <BaseConfigListItem item={item} helperOption={helperOption}>
            <Root data-testid="SwitchConfigListItem">
                <RadioGroup name={name} onChange={handleChange} value={config[name]}>
                    {labelItems.map(([label, value]) => (
                        <FormControlLabel
                            key={value}
                            value={value}
                            control={<Radio size="small" data-testid={`radio-${value}`} />}
                            label={label}
                            slotProps={{ typography: { variant: "body1", fontSize: "1rem" } }}
                        />
                    ))}
                </RadioGroup>
            </Root>
        </BaseConfigListItem>
    );
}
