import React from "react";

import { FormControlLabel, RadioGroup as MuiRadioGroup } from "@mui/material";

import Radio from "@components/UI/Radio";

export interface RadioItem {
    label: string;
    value: string;
}

export interface RadioGroupProps {
    items: RadioItem[];
    name: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
}

export default function RadioGroup({ items, name, value, onChange }: RadioGroupProps) {
    return (
        <MuiRadioGroup name={name} value={value} onChange={onChange}>
            {items.map(item => (
                <FormControlLabel key={item.value} control={<Radio />} label={item.label} value={item.value} />
            ))}
        </MuiRadioGroup>
    );
}
