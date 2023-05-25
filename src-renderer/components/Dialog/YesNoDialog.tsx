import React from "react";

import { Typography } from "@mui/material";

import { BaseDialogProps, DialogActionType } from "@components/Dialog/types";

import { BaseDialog } from "@components/Dialog/BaseDialog";
import { useTranslation } from "react-i18next";

export interface YesNoDialogProps extends BaseDialogProps<never> {
    title: string;
    content: string;

    positiveLabel?: string;
    positiveColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
    negativeLabel?: string;
}

export function YesNoDialog({
    title,
    content,
    positiveLabel,
    negativeLabel,
    positiveColor,
    ...props
}: YesNoDialogProps) {
    const { t } = useTranslation();

    return (
        <BaseDialog
            {...props}
            title={title}
            actions={[
                {
                    type: DialogActionType.Negative,
                    label: negativeLabel ?? t("dialog.common.cancel"),
                },
                {
                    type: DialogActionType.Positive,
                    label: positiveLabel ?? t("dialog.common.confirm"),
                    color: positiveColor,
                },
            ]}
        >
            <Typography variant="body1" color="textSecondary">
                {content}
            </Typography>
        </BaseDialog>
    );
}
