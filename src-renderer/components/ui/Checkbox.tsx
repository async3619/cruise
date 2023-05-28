import React from "react";

import { Checkbox as MuiCheckbox, FormControlLabel } from "@mui/material";

type BaseProps = React.ComponentProps<typeof FormControlLabel>;

export interface CheckboxProps extends Omit<BaseProps, "componentsProps" | "control"> {
    size?: "small" | "medium";
    checked?: boolean;
    indeterminate?: boolean;
}

export function Checkbox({ label, size = "medium", checked, indeterminate, ...rest }: CheckboxProps) {
    const componentsProps: BaseProps["componentsProps"] = {
        typography: {
            fontSize: "0.9rem",
            color: "text.secondary",
        },
    };

    return (
        <FormControlLabel
            control={<MuiCheckbox size={size} checked={checked} indeterminate={indeterminate} />}
            label={label}
            componentsProps={componentsProps}
            {...rest}
        />
    );
}
