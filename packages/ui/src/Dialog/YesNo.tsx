import React from "react";

import { ButtonProps, Typography } from "@mui/material";

import { BaseDialogProps, DialogActionType } from "./types";
import { BaseDialog } from "./Base";

export interface YesNoDialogProps extends BaseDialogProps<void> {
    title: string;
    description: string;
    positiveLabel: string;
    negativeLabel: string;
    positiveColor?: ButtonProps["color"];
}

export function YesNoDialog({ positiveLabel, negativeLabel, description, positiveColor, ...props }: YesNoDialogProps) {
    return (
        <BaseDialog
            {...props}
            actions={[
                { type: DialogActionType.Negative, label: negativeLabel },
                { type: DialogActionType.Positive, label: positiveLabel, color: positiveColor },
            ]}
        >
            <div data-testid="YesNoDialog">
                {description && (
                    <Typography variant="body1" color="text.secondary">
                        {description}
                    </Typography>
                )}
            </div>
        </BaseDialog>
    );
}
