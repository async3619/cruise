import React from "react";

import BaseSettingsListItem from "@components/Settings/ListItem/Base";

import { RadioSettingsItem, SettingsListItemProps } from "@components/Settings/types";
import RadioGroup from "@components/UI/RadioGroup";

export default function RadioSettingsListItem(props: SettingsListItemProps<RadioSettingsItem>) {
    const { item, value, onChange } = props;
    const { options } = item;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        onChange(item, value);
    };

    const renderTail = () => {
        const option = options.find(option => option.value === value);
        if (!option) {
            return null;
        }

        return option.label;
    };

    return (
        <BaseSettingsListItem item={item} renderTail={renderTail}>
            <RadioGroup name={item.id} items={options} value={value} onChange={handleChange} />
        </BaseSettingsListItem>
    );
}
