import React from "react";
import { Button } from "@mui/material";

export interface ActionItem extends Omit<React.ComponentProps<typeof Button>, "type"> {
    type: DialogActionType;
    label: string;
}

export enum DialogActionType {
    Submit = "submit",
    Positive = "positive",
    Negative = "negative",
}

export interface NormalDialogResult {
    type: Exclude<DialogActionType, DialogActionType.Submit>;
}

export interface SubmitDialogResult<TValue> {
    type: DialogActionType.Submit;
    value: TValue;
}

export type DialogResult<TValue = unknown> = NormalDialogResult | SubmitDialogResult<TValue>;

export interface BaseDialogProps<TValue> {
    open: boolean;
    onClose(result: DialogResult<TValue>): void;
    onClosed(): void;
}

export interface DialogContextValue {
    openDialog<TProps extends BaseDialogProps<any>>(
        component: React.ComponentType<TProps>,
        options: Omit<TProps, keyof BaseDialogProps<any>>,
    ): Promise<DialogResult<TProps extends BaseDialogProps<infer K> ? K : never>>;
}

export interface DialogItem {
    key: string;
    component: React.ComponentType<BaseDialogProps<unknown>>;
    options: Omit<BaseDialogProps<unknown>, keyof BaseDialogProps<unknown>>;
    resolve: (result: DialogResult) => void;
    closing: boolean;
}
