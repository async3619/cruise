import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

import { DialogProps } from "@mui/material";

import BaseDialog from "@components/Dialogs/Base";

import { DialogButtonType, DialogPropBase } from "@dialogs";
import { Root } from "@dialogs/Form/index.styles";

export interface FormDialogProps<TData extends FieldValues> extends DialogPropBase<TData> {
    children: React.ReactNode;
    form: UseFormReturn<TData>;
    formId?: string;
    maxWidth?: DialogProps["maxWidth"];
}
export interface FormDialogStates {}

export default class FormDialog<TData extends FieldValues> extends React.Component<
    FormDialogProps<TData>,
    FormDialogStates
> {
    private handleSubmit = (value: TData) => {
        this.props.onClose({
            reason: "submit",
            data: value,
        });
    };

    public render() {
        const { open, title, onClosed, onClose, children, form, formId, maxWidth } = this.props;
        const handleSubmit = form.handleSubmit(this.handleSubmit);
        const {
            formState: { errors },
        } = form;

        const firstError = Object.entries(errors)[0];
        const errorMessage = firstError ? firstError[1]?.message : undefined;

        return (
            <BaseDialog
                maxWidth={maxWidth}
                open={open}
                title={title}
                onClosed={onClosed}
                onClose={onClose}
                buttons={[
                    {
                        type: DialogButtonType.Cancel,
                        label: "Cancel",
                    },
                    {
                        type: DialogButtonType.Submit,
                        label: "Submit",
                        props: {
                            disabled: !!errorMessage,
                            color: "primary",
                            type: "submit",
                            form: formId,
                        },
                    },
                ]}
                helperText={errorMessage ? { text: errorMessage.toString(), type: "error" } : undefined}
            >
                <Root id={formId} onSubmit={handleSubmit}>
                    {children}
                </Root>
            </BaseDialog>
        );
    }
}
