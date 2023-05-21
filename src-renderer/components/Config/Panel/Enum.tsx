import React from "react";

import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

import { EnumConfigItem } from "@components/Config";
import { BaseConfigPanel, ConfigPanelProps } from "@components/Config/Panel/Base";

export function EnumConfigPanel<TEnum extends Record<string, string>>(props: ConfigPanelProps<EnumConfigItem<TEnum>>) {
    const { item, value } = props;
    const { enum: enumObject, enumLabels } = item;

    return (
        <BaseConfigPanel {...props} toolbar={{ type: "label", label: enumLabels[value as unknown as keyof TEnum] }}>
            <RadioGroup value={props.value} onChange={(event, value) => props.onChange(value as unknown as TEnum)}>
                {Object.values(enumObject).map(item => (
                    <FormControlLabel
                        key={item}
                        value={item}
                        control={<Radio size="small" />}
                        label={enumLabels[item]}
                        componentsProps={{
                            typography: {
                                fontSize: "0.9rem",
                            },
                        }}
                    />
                ))}
            </RadioGroup>
        </BaseConfigPanel>
    );
}
