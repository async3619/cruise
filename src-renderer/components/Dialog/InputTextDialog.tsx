import { z } from "zod";

import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField, Typography } from "@mui/material";

import { BaseDialog } from "@components/Dialog/BaseDialog";
import { BaseDialogProps, DialogActionType } from "@components/Dialog/types";

export interface InputTextFormValues {
    input: string;
}

export interface InputTextDialogProps extends BaseDialogProps<string> {
    title: string;
    content: string;
    validationSchema: z.ZodType<string>;
    defaultValue?: string;
}

export function InputTextDialog({ title, content, validationSchema, defaultValue, ...props }: InputTextDialogProps) {
    const { t } = useTranslation();
    const schema = React.useMemo(() => z.object({ input: validationSchema }), [validationSchema]);
    const { register, getFieldState, formState, handleSubmit } = useForm<InputTextFormValues>({
        mode: "all",
        resolver: zodResolver(schema),
        defaultValues: {
            input: defaultValue || "",
        },
    });

    const fieldState = getFieldState("input");
    const onSubmit = handleSubmit(data => {
        props.onClose({
            type: DialogActionType.Submit,
            value: data.input,
        });
    });

    return (
        <BaseDialog
            {...props}
            onSubmit={onSubmit}
            title={title}
            maxWidth="xs"
            fullWidth
            actions={[
                {
                    type: DialogActionType.Negative,
                    label: t("common.cancel"),
                },
                {
                    type: DialogActionType.Submit,
                    label: t("common.create"),
                    disabled: !formState.isValid,
                },
            ]}
        >
            <Typography variant="body1" color="textSecondary">
                {content}
            </Typography>
            <Box mt={2}>
                <TextField
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    label={t("playlist.name")}
                    {...register("input")}
                />
            </Box>
        </BaseDialog>
    );
}
