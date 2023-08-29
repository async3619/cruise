import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";

import { BaseDialogProps, DialogActionType } from "./types";
import { BaseDialog } from "./Base";

export interface InputTextFormValues {
    input: string;
}

export interface InputTextDialogProps extends BaseDialogProps<string> {
    title: string;
    description?: string;
    positiveLabel: string;
    negativeLabel: string;
    placeholder?: string;
    validationSchema: z.ZodType<string>;
    defaultValue?: string;
}

export function InputTextDialog({
    title,
    description,
    negativeLabel,
    positiveLabel,
    placeholder,
    validationSchema,
    defaultValue,
    ...props
}: InputTextDialogProps) {
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
            fullWidth
            maxWidth="xs"
            title={title}
            actions={[
                { type: DialogActionType.Negative, label: negativeLabel },
                { type: DialogActionType.Submit, label: positiveLabel, disabled: !formState.isValid },
            ]}
        >
            {description && (
                <Typography variant="body1" color="text.secondary">
                    {description}
                </Typography>
            )}
            <TextField
                size="small"
                autoFocus
                fullWidth
                placeholder={placeholder}
                sx={{ mt: 1.5 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                {...register("input")}
            />
        </BaseDialog>
    );
}
