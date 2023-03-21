import React from "react";
import { IsEmpty, Required } from "@utils/types";

export enum DialogButtonType {
    Ok,
    Cancel,
    Submit,
}

export interface OutsideClickedDialogResult {
    reason: "outside-clicked";
}
export interface ButtonClickedDialogResult {
    reason: "button-clicked";
    buttonType: DialogButtonType;
}
export interface EscapePressedDialogResult {
    reason: "escape-pressed";
}
export interface SubmitDialogResult<TData> {
    reason: "submit";
    data: TData;
}

export type DialogResult<TData> =
    | OutsideClickedDialogResult
    | ButtonClickedDialogResult
    | EscapePressedDialogResult
    | SubmitDialogResult<TData>;

export interface DialogPropBase<TData> {
    open: boolean;
    title: string;
    onClose(result: DialogResult<TData>): void;
    onClosed(): void;
    __data?: TData;
}

export interface DialogContextValue {
    showDialog<TProps extends DialogPropBase<any>>(
        component: React.ComponentType<TProps>,
        title: string,
        ...args: IsEmpty<Omit<TProps, keyof DialogPropBase<any>>, [], [data: Omit<TProps, keyof DialogPropBase<any>>]>
    ): Promise<DialogResult<Required<TProps["__data"]>>>;

    showBackdrop(): void;
    hideBackdrop(): void;
}

export const DialogContext = React.createContext<DialogContextValue>({
    showDialog() {
        throw new Error("DialogContext not initialized");
    },
    showBackdrop() {
        throw new Error("DialogContext not initialized");
    },
    hideBackdrop() {
        throw new Error("DialogContext not initialized");
    },
});
